class RectanglePrimitive {
    constructor(config) {
        this._config = config
        this._paneViews = [new RectanglePaneView(this)]
    }

    updateAllViews() {
        this._paneViews.forEach(view => view.update())
    }

    paneViews() {
        return this._paneViews
    }

    attached({ chart, series, requestUpdate }) {
        this._chart = chart
        this._series = series
        this._requestUpdate = requestUpdate
        this._timeScale = chart.timeScale()
    }

    detached() {
        this._chart = null
        this._series = null
        this._requestUpdate = null
        this._timeScale = null
    }

    getCoordinates() {
        if (!this._timeScale || !this._series) return null

        const x1 = this._timeScale.timeToCoordinate(this._config.startTime)
        const x2 = this._timeScale.timeToCoordinate(this._config.endTime)
        const y1 = this._series.priceToCoordinate(this._config.highPrice)
        const y2 = this._series.priceToCoordinate(this._config.lowPrice)

        if (x1 === null || x2 === null || y1 === null || y2 === null) {
            return null
        }

        return { x1, y1, x2, y2 }
    }

    getConfig() {
        return this._config
    }
}

class RectanglePaneView {
    constructor(primitive) {
        this._primitive = primitive
    }

    update() {
    }

    renderer() {
        return new RectangleRenderer(this._primitive)
    }
}

class RectangleRenderer {
    constructor(primitive) {
        this._primitive = primitive
    }

    draw(target) {
        const coords = this._primitive.getCoordinates()
        if (!coords) return

        const config = this._primitive.getConfig()

        target.useBitmapCoordinateSpace(scope => {
            const ctx = scope.context

            const x1 = Math.round(coords.x1 * scope.horizontalPixelRatio)
            const y1 = Math.round(coords.y1 * scope.verticalPixelRatio)
            const x2 = Math.round(coords.x2 * scope.horizontalPixelRatio)
            const y2 = Math.round(coords.y2 * scope.verticalPixelRatio)

            const width = x2 - x1
            const height = y2 - y1

            ctx.fillStyle = config.fillColor || 'rgba(0, 0, 255, 0.2)'
            ctx.fillRect(x1, y1, width, height)

            if (config.borderColor) {
                ctx.strokeStyle = config.borderColor
                ctx.lineWidth = (config.borderWidth || 2) * scope.verticalPixelRatio
                ctx.strokeRect(x1, y1, width, height)
            }
        })
    }
}

export default RectanglePrimitive
