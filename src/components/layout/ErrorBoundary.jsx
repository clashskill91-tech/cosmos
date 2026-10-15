import { Component } from 'react'
export default class ErrorBoundary extends Component {
  state = { err: null }
  static getDerivedStateFromError(err) { return { err } }
  render() {
    if (!this.state.err) return this.props.children
    return <div className="p-10 text-center"><h1 className="font-display text-4xl">Nimadir xato ketdi.</h1>
      <p className="mt-3 text-slate-300">{this.props.label || 'Qayta urinish uchun sahifani yangilang.'}</p></div>
  }
}
