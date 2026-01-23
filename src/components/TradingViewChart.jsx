'use client'

import { useEffect, useRef, useState } from 'react'
import { createChart, ColorType } from 'lightweight-charts'
import RectanglePrimitive from './RectanglePlugin'

const TradingViewChart = ({
    data = [],
    orderBlocks = [],
    bosMarkers = [],
    chochMarkers = [],
    height = 600,
    showBrokenBlocks = false,
    highlightedOrderBlock = null,
    tradeDetails = null,
    strategy = '',
    emaData = null
}) => {
    const chartContainerRef = useRef(null)
    const chartRef = useRef(null)
    const candlestickSeriesRef = useRef(null)
    const tooltipRef = useRef(null)
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, high: 0, low: 0 })
    const orderBlockDataRef = useRef([])

    useEffect(() => {
        if (!chartContainerRef.current || !data.length) return

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'white' },
                textColor: 'black'
            },
            width: chartContainerRef.current.clientWidth,
            height: height,
            grid: {
                vertLines: { color: '#f0f0f0' },
                horzLines: { color: '#f0f0f0' }
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false
            }
        })

        chartRef.current = chart

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350'
        })

        candlestickSeriesRef.current = candlestickSeries

        let volumeSeries = null
        if (strategy === 'volume-spike') {
            volumeSeries = chart.addHistogramSeries({
                color: '#26a69a',
                priceFormat: {
                    type: 'volume',
                },
                priceScaleId: '', // Set as an overlay by setting a blank priceScaleId
                scaleMargins: {
                    top: 0.8, // Highest volume bar will be 80% down from the top
                    bottom: 0,
                },
            })
        }

        const chartData = data
            .map(d => ({
                time: d.time,
                open: d.open,
                high: d.high,
                low: d.low,
                close: d.close
            }))
            .sort((a, b) => a.time - b.time)

        candlestickSeries.setData(chartData)

        if (volumeSeries) {
            const volumeData = data
                .map(d => ({
                    time: d.time,
                    value: d.volume,
                    color: d.close >= d.open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)',
                }))
                .sort((a, b) => a.time - b.time)

            volumeSeries.setData(volumeData)
        }

        // Add EMA lines if emaData is provided
        if (emaData && emaData.ema9 && emaData.ema9.length > 0) {
            const ema9Series = chart.addLineSeries({
                color: '#2962FF',
                lineWidth: 2,
                title: 'EMA 9'
            })
            ema9Series.setData(emaData.ema9.sort((a, b) => a.time - b.time))
        }

        if (emaData && emaData.ema15 && emaData.ema15.length > 0) {
            const ema15Series = chart.addLineSeries({
                color: '#FF6D00',
                lineWidth: 2,
                title: 'EMA 15'
            })
            ema15Series.setData(emaData.ema15.sort((a, b) => a.time - b.time))
        }

        const primitives = []
        orderBlockDataRef.current = []

        orderBlocks.forEach((block, index) => {
            if (block.is_broken && !showBrokenBlocks) return

            const isBearish = block.type === 'bearish_reversal'
            const isBullish = block.type === 'bullish_reversal'

            const startTime = block.startTime || Math.floor(new Date(block.start).getTime() / 1000)
            const endTime = block.endTime || Math.floor(new Date(block.end).getTime() / 1000)
            const isHighlightedFromSignal = block.is_highlighted === true

            let isHighlighted = false
            if (
                highlightedOrderBlock &&
                highlightedOrderBlock.block_high &&
                highlightedOrderBlock.block_low &&
                !isHighlightedFromSignal
            ) {
                const blockHigh = parseFloat(block.high)
                const blockLow = parseFloat(block.low)
                const highlightHigh = parseFloat(highlightedOrderBlock.block_high)
                const highlightLow = parseFloat(highlightedOrderBlock.block_low)

                const priceMatch = Math.abs(blockHigh - highlightHigh) < 0.05 && Math.abs(blockLow - highlightLow) < 0.05

                let timeMatch = true
                if (highlightedOrderBlock.start_time && highlightedOrderBlock.end_time) {
                    const highlightStartTime = Math.floor(new Date(highlightedOrderBlock.start_time).getTime() / 1000)
                    const highlightEndTime = Math.floor(new Date(highlightedOrderBlock.end_time).getTime() / 1000)
                    timeMatch = Math.abs(startTime - highlightStartTime) < 14400 && Math.abs(endTime - highlightEndTime) < 14400
                }

                isHighlighted = priceMatch && timeMatch
            }

            let fillColor, borderColor, borderWidth

            if (isHighlightedFromSignal) {
                fillColor = 'rgba(255, 165, 0, 0.5)'
                borderColor = 'rgba(255, 140, 0, 1)'
                borderWidth = 4
            } else if (isHighlighted) {
                fillColor = 'rgba(255, 165, 0, 0.5)'
                fillColor = 'rgba(255, 165, 0, 0.5)'
                borderColor = 'rgba(255, 140, 0, 1)'
                borderWidth = 4
            } else {
                if (isBullish) {
                    fillColor = block.is_broken ? 'rgba(0, 255, 0, 0.15)' : 'rgba(0, 255, 0, 0.3)'
                    borderColor = block.is_broken ? 'rgba(0, 200, 0, 0.4)' : 'rgba(0, 200, 0, 0.7)'
                    borderWidth = block.is_broken ? 1 : 2
                } else if (isBearish) {
                    fillColor = block.is_broken ? 'rgba(255, 0, 0, 0.15)' : 'rgba(255, 0, 0, 0.3)'
                    borderColor = block.is_broken ? 'rgba(200, 0, 0, 0.4)' : 'rgba(200, 0, 0, 0.7)'
                    borderWidth = block.is_broken ? 1 : 2
                } else {
                    fillColor = block.is_broken ? 'rgba(255, 0, 0, 0.15)' : 'rgba(255, 0, 0, 0.3)'
                    borderColor = block.is_broken ? 'rgba(200, 0, 0, 0.4)' : 'rgba(200, 0, 0, 0.7)'
                    borderWidth = block.is_broken ? 1 : 2
                }
            }

            const rectanglePrimitive = new RectanglePrimitive({
                startTime,
                endTime,
                lowPrice: block.low,
                highPrice: block.high,
                fillColor,
                borderColor,
                borderWidth
            })

            candlestickSeries.attachPrimitive(rectanglePrimitive)
            primitives.push(rectanglePrimitive)

            orderBlockDataRef.current.push({
                primitive: rectanglePrimitive,
                high: block.high,
                low: block.low,
                startTime,
                endTime
            })
        })

        const findCandleAndPosition = (markerTime, markerPrice) => {
            const candle = chartData.find(c => c.time === markerTime)
            if (!candle) {
                const closestCandle = chartData.reduce((prev, curr) => {
                    return Math.abs(curr.time - markerTime) < Math.abs(prev.time - markerTime) ? curr : prev
                })
                const isAbove = markerPrice >= closestCandle.close
                return {
                    time: closestCandle.time,
                    position: isAbove ? 'aboveBar' : 'belowBar'
                }
            }
            const isAbove = markerPrice >= candle.close
            return {
                time: candle.time,
                position: isAbove ? 'aboveBar' : 'belowBar'
            }
        }

        const allMarkers = [
            ...bosMarkers.map(marker => {
                const isBullish = marker.type === 'bullish_bos'
                const { time, position } = findCandleAndPosition(marker.time, marker.price)
                return {
                    time: time,
                    position: position,
                    color: isBullish ? '#26a69a' : '#ef5350',
                    shape: isBullish ? 'arrowUp' : 'arrowDown',
                    text: `${isBullish ? 'BOS↑' : 'BOS↓'} ${marker.price.toFixed(2)}`,
                    size: 1
                }
            }),
            ...chochMarkers.map(marker => {
                const isBullish = marker.type === 'bullish_choch'
                const { time, position } = findCandleAndPosition(marker.time, marker.price)
                return {
                    time: time,
                    position: position,
                    color: isBullish ? '#4ecdc4' : '#ff9800',
                    shape: isBullish ? 'arrowUp' : 'arrowDown',
                    text: `${isBullish ? 'ChoCH↑' : 'ChoCH↓'} ${marker.price.toFixed(2)}`,
                    size: 1
                }
            })

        ]

        // Add trade markers if available
        if (tradeDetails) {
            // Handle both single trade object and array of trades
            const trades = Array.isArray(tradeDetails) ? tradeDetails : [tradeDetails];
            
            trades.forEach((trade) => {
                const { entryTime, exitTime, entryPrice, exitPrice, orderType } = trade;
                const isBullish = orderType?.toUpperCase() === 'BULLISH' || orderType?.toLowerCase() === 'buy';

                if (entryTime) {
                    const entryTimestamp = Math.floor(new Date(entryTime).getTime() / 1000);
                    
                    // Find the candle at entry time to get the price
                    const entryCandle = chartData.find(c => c.time === entryTimestamp) || 
                                       chartData.reduce((prev, curr) => {
                                           return Math.abs(curr.time - entryTimestamp) < Math.abs(prev.time - entryTimestamp) ? curr : prev;
                                       });
                    
                    const actualEntryPrice = entryPrice || entryCandle.close;
                    const { time, position } = findCandleAndPosition(entryTimestamp, actualEntryPrice);
                    
                    allMarkers.push({
                        time: time,
                        position: position,
                        color: '#2196f3', // Blue for entry
                        shape: isBullish ? 'arrowUp' : 'arrowDown',
                        text: `Entry: ${actualEntryPrice.toFixed(2)}`,
                        size: 2
                    });
                }

                if (exitTime) {
                    const exitTimestamp = Math.floor(new Date(exitTime).getTime() / 1000);
                    
                    // Find the candle at exit time to get the price
                    const exitCandle = chartData.find(c => c.time === exitTimestamp) || 
                                      chartData.reduce((prev, curr) => {
                                          return Math.abs(curr.time - exitTimestamp) < Math.abs(prev.time - exitTimestamp) ? curr : prev;
                                      });
                    
                    const actualExitPrice = exitPrice || exitCandle.close;
                    const { time, position } = findCandleAndPosition(exitTimestamp, actualExitPrice);
                    
                    allMarkers.push({
                        time: time,
                        position: position,
                        color: '#9c27b0', // Purple for exit
                        shape: isBullish ? 'arrowDown' : 'arrowUp',
                        text: `Exit: ${actualExitPrice.toFixed(2)}`,
                        size: 2
                    });
                }
            });
        }

        allMarkers.sort((a, b) => a.time - b.time)

        if (allMarkers.length > 0) {
            candlestickSeries.setMarkers(allMarkers)
        }

        chart.timeScale().fitContent()

        const checkOrderBlockHover = (mouseX, mouseY) => {
            if (!chart || !candlestickSeries) return null

            for (const blockData of orderBlockDataRef.current) {
                const coords = blockData.primitive.getCoordinates()
                if (!coords) continue

                const x1 = Math.min(coords.x1, coords.x2)
                const x2 = Math.max(coords.x1, coords.x2)
                const y1 = Math.min(coords.y1, coords.y2)
                const y2 = Math.max(coords.y1, coords.y2)

                const tolerance = 2
                if (
                    mouseX >= x1 - tolerance &&
                    mouseX <= x2 + tolerance &&
                    mouseY >= y1 - tolerance &&
                    mouseY <= y2 + tolerance
                ) {
                    return {
                        high: blockData.high,
                        low: blockData.low
                    }
                }
            }

            return null
        }

        const handleMouseMove = event => {
            if (!chartContainerRef.current || !chart) return

            const rect = chartContainerRef.current.getBoundingClientRect()
            const mouseX = event.clientX - rect.left
            const mouseY = event.clientY - rect.top

            const hoveredBlock = checkOrderBlockHover(mouseX, mouseY)

            if (hoveredBlock) {
                const tooltipOffset = 15
                let tooltipX = event.clientX + tooltipOffset
                let tooltipY = event.clientY + tooltipOffset
                if (tooltipX > window.innerWidth - 200) {
                    tooltipX = event.clientX - 200
                }
                if (tooltipY > window.innerHeight - 100) {
                    tooltipY = event.clientY - 100
                }

                setTooltip({
                    visible: true,
                    x: tooltipX,
                    y: tooltipY,
                    high: hoveredBlock.high,
                    low: hoveredBlock.low
                })
            } else {
                setTooltip(prev => ({ ...prev, visible: false }))
            }
        }

        const handleMouseLeave = () => {
            setTooltip(prev => ({ ...prev, visible: false }))
        }

        const container = chartContainerRef.current
        if (container) {
            container.addEventListener('mousemove', handleMouseMove)
            container.addEventListener('mouseleave', handleMouseLeave)
        }

        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth
                })
            }
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
            if (container) {
                container.removeEventListener('mousemove', handleMouseMove)
                container.removeEventListener('mouseleave', handleMouseLeave)
            }
            if (chartRef.current) {
                chartRef.current.remove()
                chartRef.current = null
            }
        }
    }, [data, orderBlocks, bosMarkers, chochMarkers, height, showBrokenBlocks, highlightedOrderBlock, tradeDetails, strategy, emaData])

    if (!data.length) {
        return (
            <div className='flex items-center justify-center' style={{ height }}>
                <div className='text-center'>
                    <p className='text-gray-600'>No data available</p>
                </div>
            </div>
        )
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: height }}>
            <div ref={chartContainerRef} style={{ width: '100%', height: height }} />
            {tooltip.visible && (
                <div
                    ref={tooltipRef}
                    style={{
                        position: 'fixed',
                        left: `${tooltip.x}px`,
                        top: `${tooltip.y}px`,
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        pointerEvents: 'none',
                        zIndex: 1000,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                        whiteSpace: 'nowrap'
                    }}
                >
                    <div
                        style={{
                            fontWeight: 'bold',
                            marginBottom: '4px',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                            paddingBottom: '4px'
                        }}
                    >
                        Order Block
                    </div>
                    <div>High: ${tooltip.high.toFixed(2)}</div>
                    <div>Low: ${tooltip.low.toFixed(2)}</div>
                </div>
            )}
        </div>
    )
}

export default TradingViewChart
