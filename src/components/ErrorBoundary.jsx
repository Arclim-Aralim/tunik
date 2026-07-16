import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="section error-state">
          <p className="eyebrow">Ошибка отображения</p>
          <h1>Страница не загрузилась</h1>
          <p>
            Обнови страницу. Если ошибка повторится, значит один из блоков сайта
            упал при выполнении в браузере.
          </p>
          <button type="button" onClick={() => window.location.reload()}>
            Обновить
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
