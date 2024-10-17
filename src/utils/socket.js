const initializeWebSocket = async (setLivePrices, additionalTokens, socketRef) => {

    const webSocketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    socketRef.current = new WebSocket(webSocketUrl);

    socketRef.current.onopen = () => {
        console.log('WebSocket connected');
        additionalTokens.forEach(token => {
            socketRef.current.send(JSON.stringify({ action: 'subscribe', token }));
        });
    };

    socketRef.current.onmessage = (event) => {
        try {
            const jsonData = JSON.parse(event.data);
            const { token, ltp } = jsonData;
            setLivePrices(prevPrices => ({
                ...prevPrices,
                [token]: { ltp }
            }));
        } catch (error) {
            console.error('Failed to parse JSON:', error);
        }
    };

    socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    socketRef.current.onclose = () => {
        console.log('WebSocket connection closed');
    };
};

export { initializeWebSocket };