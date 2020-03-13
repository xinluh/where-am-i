import React from "react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.errorMessage !== null && (
          <p>
            {this.props.errorMessage
              ? this.props.errorMessage
              : "Something went wrong."}
          </p>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
