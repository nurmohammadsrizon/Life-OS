const PlaceholderPage = ({ title, description }) => {
  return (
    <div className="placeholder-page">
      <div className="placeholder-content">
        <h1>{title}</h1>
        <p>
          {description || `${title} section is ready for your next update.`}
        </p>
      </div>
    </div>
  )
}

export default PlaceholderPage
