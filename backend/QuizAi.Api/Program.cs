using System.Globalization;
using CsvHelper;
using Microsoft.ML;
using Microsoft.ML.Data;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls("http://localhost:5087");

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .SetIsOriginAllowed(origin =>
            {
                if (!Uri.TryCreate(origin, UriKind.Absolute, out var uri))
                {
                    return false;
                }

                return uri.Scheme == "http"
                    && (uri.Host == "localhost" || uri.Host == "127.0.0.1");
            })
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddSingleton<SpecialtyRecommender>();

var app = builder.Build();

app.UseCors();

app.MapGet("/api/health", () => Results.Ok(new { status = "ok", service = "quiz-ai" }));

app.MapPost("/api/recommend", (QuizRequest request, SpecialtyRecommender recommender) =>
{
    if (request.Answers.Count == 0)
    {
        return Results.BadRequest(new { message = "Нужно выбрать хотя бы один ответ." });
    }

    return Results.Ok(recommender.Recommend(request));
});

app.Run();

public sealed record QuizRequest(Dictionary<int, int> Answers);

public sealed record ProgramRecommendation(
    string Id,
    double Score,
    double Confidence,
    IReadOnlyList<string> Reasons,
    IReadOnlyDictionary<string, double> Traits
);

public sealed record QuizRecommendationResponse(
    string ProgramId,
    double Confidence,
    string Summary,
    IReadOnlyList<string> Reasons,
    IReadOnlyList<ProgramRecommendation> Alternatives
);

public sealed class SpecialtyRecommender
{
    private readonly MLContext _ml = new(seed: 7);
    private readonly PredictionEngine<SpecialtyInput, SpecialtyPrediction> _predictionEngine;
    private readonly IReadOnlyList<TrainingRow> _trainingRows;

    private static readonly string[] TraitNames =
    [
        "engineering",
        "data",
        "creative",
        "business",
        "physical",
        "communication",
        "research"
    ];

    private static readonly Dictionary<int, Dictionary<int, float[]>> AnswerVectors = new()
    {
        [0] = new()
        {
            [0] = [0.90f, 0.40f, 0.12f, 0.28f, 0.64f, 0.18f, 0.34f],
            [1] = [0.18f, 0.98f, 0.20f, 0.24f, 0.06f, 0.16f, 0.88f],
            [2] = [0.16f, 0.32f, 0.96f, 0.24f, 0.06f, 0.46f, 0.22f],
            [3] = [0.82f, 0.40f, 0.10f, 0.12f, 0.98f, 0.14f, 0.42f],
        },
        [1] = new()
        {
            [0] = [0.92f, 0.28f, 0.10f, 0.28f, 0.78f, 0.18f, 0.34f],
            [1] = [0.72f, 0.32f, 0.14f, 0.14f, 0.96f, 0.16f, 0.44f],
            [2] = [0.12f, 0.32f, 0.98f, 0.18f, 0.04f, 0.44f, 0.16f],
            [3] = [0.08f, 0.26f, 0.46f, 0.56f, 0.04f, 0.98f, 0.18f],
        },
        [2] = new()
        {
            [0] = [0.18f, 1.00f, 0.16f, 0.18f, 0.04f, 0.12f, 0.96f],
            [1] = [0.14f, 0.36f, 0.86f, 0.34f, 0.06f, 0.74f, 0.18f],
            [2] = [0.10f, 0.38f, 0.18f, 0.98f, 0.02f, 0.76f, 0.28f],
            [3] = [0.86f, 0.36f, 0.10f, 0.10f, 1.00f, 0.12f, 0.38f],
        },
        [3] = new()
        {
            [0] = [0.74f, 0.38f, 0.18f, 0.46f, 0.54f, 0.34f, 0.32f],
            [1] = [0.18f, 0.96f, 0.14f, 0.42f, 0.04f, 0.24f, 0.88f],
            [2] = [0.10f, 0.30f, 0.98f, 0.22f, 0.04f, 0.42f, 0.16f],
            [3] = [0.86f, 0.32f, 0.08f, 0.12f, 1.00f, 0.12f, 0.34f],
        },
        [4] = new()
        {
            [0] = [0.90f, 0.34f, 0.10f, 0.18f, 0.92f, 0.16f, 0.36f],
            [1] = [0.22f, 0.88f, 0.16f, 0.34f, 0.04f, 0.18f, 0.98f],
            [2] = [0.12f, 0.28f, 1.00f, 0.24f, 0.04f, 0.54f, 0.16f],
            [3] = [0.06f, 0.26f, 0.40f, 0.74f, 0.02f, 1.00f, 0.20f],
        },
        [5] = new()
        {
            [0] = [0.96f, 0.34f, 0.18f, 0.26f, 0.72f, 0.18f, 0.40f],
            [1] = [0.22f, 0.98f, 0.20f, 0.18f, 0.04f, 0.14f, 0.88f],
            [2] = [0.18f, 0.36f, 0.98f, 0.18f, 0.04f, 0.38f, 0.20f],
            [3] = [0.06f, 0.32f, 0.26f, 1.00f, 0.02f, 0.84f, 0.22f],
        },
        [6] = new()
        {
            [0] = [0.82f, 0.30f, 0.10f, 0.08f, 1.00f, 0.10f, 0.36f],
            [1] = [0.94f, 0.24f, 0.08f, 0.22f, 0.76f, 0.18f, 0.30f],
            [2] = [0.14f, 0.34f, 0.66f, 0.42f, 0.10f, 0.88f, 0.18f],
            [3] = [0.16f, 0.84f, 0.74f, 0.16f, 0.04f, 0.22f, 0.62f],
        },
        [7] = new()
        {
            [0] = [0.20f, 1.00f, 0.14f, 0.30f, 0.04f, 0.14f, 0.88f],
            [1] = [0.88f, 0.42f, 0.06f, 0.08f, 0.98f, 0.08f, 0.44f],
            [2] = [0.34f, 0.42f, 0.94f, 0.12f, 0.10f, 0.24f, 0.24f],
            [3] = [0.08f, 0.48f, 0.16f, 1.00f, 0.02f, 0.62f, 0.30f],
        },
        [8] = new()
        {
            [0] = [0.14f, 0.36f, 0.88f, 0.36f, 0.06f, 0.82f, 0.18f],
            [1] = [0.18f, 1.00f, 0.14f, 0.14f, 0.04f, 0.12f, 0.90f],
            [2] = [0.92f, 0.34f, 0.08f, 0.08f, 1.00f, 0.10f, 0.36f],
            [3] = [0.08f, 0.42f, 0.14f, 1.00f, 0.02f, 0.66f, 0.26f],
        },
        [9] = new()
        {
            [0] = [0.84f, 0.34f, 0.14f, 0.62f, 0.56f, 0.32f, 0.26f],
            [1] = [0.18f, 0.98f, 0.16f, 0.20f, 0.04f, 0.14f, 0.94f],
            [2] = [0.14f, 0.34f, 0.98f, 0.20f, 0.04f, 0.42f, 0.18f],
            [3] = [0.06f, 0.34f, 0.22f, 1.00f, 0.02f, 0.88f, 0.24f],
        },
        [10] = new()
        {
            [0] = [0.86f, 0.36f, 0.36f, 0.12f, 0.92f, 0.18f, 0.42f],
            [1] = [0.28f, 0.98f, 0.14f, 0.14f, 0.04f, 0.12f, 1.00f],
            [2] = [0.12f, 0.30f, 0.96f, 0.22f, 0.04f, 0.72f, 0.14f],
            [3] = [0.06f, 0.34f, 0.18f, 1.00f, 0.02f, 0.92f, 0.24f],
        },
        [11] = new()
        {
            [0] = [0.28f, 0.74f, 0.66f, 0.10f, 0.06f, 0.20f, 0.50f],
            [1] = [0.78f, 0.28f, 0.08f, 0.12f, 0.74f, 0.16f, 0.30f],
            [2] = [0.06f, 0.28f, 0.34f, 0.78f, 0.02f, 1.00f, 0.16f],
            [3] = [0.92f, 0.24f, 0.06f, 0.08f, 1.00f, 0.08f, 0.32f],
        },
    };

    private static readonly Dictionary<string, string> TraitLabels = new()
    {
        ["engineering"] = "инженерное мышление",
        ["data"] = "интерес к данным и алгоритмам",
        ["creative"] = "визуальное и продуктовое мышление",
        ["business"] = "стратегия и экономика",
        ["physical"] = "интерес к реальным устройствам",
        ["communication"] = "коммуникации и работа с аудиторией",
        ["research"] = "исследовательский подход",
    };

    public SpecialtyRecommender(IHostEnvironment environment)
    {
        var csvPath = Path.Combine(environment.ContentRootPath, "Data", "quiz-training.csv");
        _trainingRows = LoadTrainingRows(csvPath);

        var trainingData = _ml.Data.LoadFromEnumerable(_trainingRows);
        var pipeline = _ml.Transforms.Conversion.MapValueToKey("Label", nameof(TrainingRow.ProgramId))
            .Append(_ml.Transforms.Concatenate(
                "Features",
                nameof(TrainingRow.Engineering),
                nameof(TrainingRow.Data),
                nameof(TrainingRow.Creative),
                nameof(TrainingRow.Business),
                nameof(TrainingRow.Physical),
                nameof(TrainingRow.Communication),
                nameof(TrainingRow.Research)))
            .Append(_ml.MulticlassClassification.Trainers.SdcaMaximumEntropy("Label", "Features"))
            .Append(_ml.Transforms.Conversion.MapKeyToValue(nameof(SpecialtyPrediction.PredictedLabel)));

        var model = pipeline.Fit(trainingData);
        _predictionEngine = _ml.Model.CreatePredictionEngine<SpecialtyInput, SpecialtyPrediction>(model);
    }

    public QuizRecommendationResponse Recommend(QuizRequest request)
    {
        var vector = BuildInterestVector(request.Answers);
        var input = SpecialtyInput.FromVector(vector);
        var prediction = _predictionEngine.Predict(input);

        var scored = _trainingRows
            .GroupBy(row => row.ProgramId)
            .Select(group =>
            {
                var profile = Average(group);
                var score = CosineSimilarity(vector, profile);
                return new ProgramRecommendation(
                    group.Key,
                    Math.Round(score, 4),
                    0,
                    BuildReasons(vector, profile),
                    ToTraitMap(profile)
                );
            })
            .OrderByDescending(item => item.Id == prediction.PredictedLabel ? item.Score + 0.05 : item.Score)
            .ToList();

        var best = scored[0];
        var second = scored.Count > 1 ? scored[1] : best;
        var modelConfidence = SoftmaxConfidence(prediction.Score);
        var distanceConfidence = Math.Clamp((best.Score - second.Score) * 3.2 + 0.54, 0.54, 0.96);
        var confidence = Math.Clamp((modelConfidence + distanceConfidence) / 2, 0.54, 0.96);
        var alternatives = scored
            .Take(3)
            .Select(item => item with
            {
                Confidence = item.Id == best.Id ? Math.Round(confidence, 2) : Math.Round(Math.Max(0.24, item.Score / best.Score * confidence), 2)
            })
            .ToList();

        return new QuizRecommendationResponse(
            best.Id,
            Math.Round(confidence, 2),
            BuildSummary(best.Id, confidence),
            best.Reasons,
            alternatives
        );
    }

    private static IReadOnlyList<TrainingRow> LoadTrainingRows(string csvPath)
    {
        using var reader = new StreamReader(csvPath);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
        return csv.GetRecords<TrainingRow>().ToList();
    }

    private static float[] BuildInterestVector(Dictionary<int, int> answers)
    {
        var vector = new float[TraitNames.Length];
        var used = 0;

        foreach (var (questionIndex, optionIndex) in answers)
        {
            if (!AnswerVectors.TryGetValue(questionIndex, out var options)) continue;
            if (!options.TryGetValue(optionIndex, out var answerVector)) continue;

            for (var i = 0; i < vector.Length; i++)
            {
                vector[i] += answerVector[i];
            }

            used++;
        }

        if (used == 0) return vector;

        for (var i = 0; i < vector.Length; i++)
        {
            vector[i] /= used;
        }

        return vector;
    }

    private static float[] Average(IEnumerable<TrainingRow> rows)
    {
        var list = rows.ToList();
        var vector = new float[TraitNames.Length];

        foreach (var row in list)
        {
            var values = row.ToVector();
            for (var i = 0; i < vector.Length; i++)
            {
                vector[i] += values[i];
            }
        }

        for (var i = 0; i < vector.Length; i++)
        {
            vector[i] /= list.Count;
        }

        return vector;
    }

    private static IReadOnlyList<string> BuildReasons(float[] interests, float[] profile)
    {
        return TraitNames
            .Select((trait, index) => new
            {
                Trait = trait,
                Weight = interests[index] * profile[index],
            })
            .OrderByDescending(item => item.Weight)
            .Take(3)
            .Select(item => TraitLabels[item.Trait])
            .ToList();
    }

    private static IReadOnlyDictionary<string, double> ToTraitMap(float[] vector)
    {
        return TraitNames
            .Select((trait, index) => new { trait, value = Math.Round(vector[index], 2) })
            .ToDictionary(item => item.trait, item => item.value);
    }

    private static string BuildSummary(string programId, double confidence)
    {
        var certainty = confidence > 0.82 ? "высокое совпадение" : confidence > 0.68 ? "хорошее совпадение" : "предварительное совпадение";
        return $"{certainty}: ответы ближе всего к профилю направления «{ProgramNames[programId]}».";
    }

    private static double CosineSimilarity(float[] left, float[] right)
    {
        var dot = 0.0;
        var leftNorm = 0.0;
        var rightNorm = 0.0;

        for (var i = 0; i < left.Length; i++)
        {
            dot += left[i] * right[i];
            leftNorm += left[i] * left[i];
            rightNorm += right[i] * right[i];
        }

        if (leftNorm == 0 || rightNorm == 0) return 0;
        return dot / (Math.Sqrt(leftNorm) * Math.Sqrt(rightNorm));
    }

    private static double SoftmaxConfidence(float[] scores)
    {
        if (scores.Length == 0) return 0.54;

        var max = scores.Max();
        var exponents = scores.Select(score => Math.Exp(score - max)).ToArray();
        var sum = exponents.Sum();
        return Math.Clamp(exponents.Max() / sum, 0.54, 0.96);
    }

    private static readonly Dictionary<string, string> ProgramNames = new()
    {
        ["construction"] = "Цифровое гражданское строительство",
        ["ai"] = "Машинное обучение и искусственный интеллект",
        ["games"] = "Разработка игр и прикладных программ",
        ["web-design"] = "Веб-разработка и дизайн",
        ["media"] = "Медиатехнологии и инфокоммуникации",
        ["robotics"] = "Беспилотные системы и технологии",
        ["aviation"] = "Беспилотные авиационные системы",
        ["business"] = "Международный бизнес",
    };
}

public sealed class TrainingRow
{
    public string ProgramId { get; set; } = "";
    public float Engineering { get; set; }
    public float Data { get; set; }
    public float Creative { get; set; }
    public float Business { get; set; }
    public float Physical { get; set; }
    public float Communication { get; set; }
    public float Research { get; set; }

    public float[] ToVector()
    {
        return [Engineering, Data, Creative, Business, Physical, Communication, Research];
    }
}

public sealed class SpecialtyInput
{
    public string ProgramId { get; set; } = "";
    public float Engineering { get; set; }
    public float Data { get; set; }
    public float Creative { get; set; }
    public float Business { get; set; }
    public float Physical { get; set; }
    public float Communication { get; set; }
    public float Research { get; set; }

    public static SpecialtyInput FromVector(float[] vector)
    {
        return new SpecialtyInput
        {
            Engineering = vector[0],
            Data = vector[1],
            Creative = vector[2],
            Business = vector[3],
            Physical = vector[4],
            Communication = vector[5],
            Research = vector[6],
        };
    }
}

public sealed class SpecialtyPrediction
{
    [ColumnName("PredictedLabel")]
    public string PredictedLabel { get; set; } = "";

    public float[] Score { get; set; } = [];
}
