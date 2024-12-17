export const renewMedia = async (mediaId: number, renewedEndDate: Date) => {
    if (process.env.NODE_ENV === 'development') {
        return true;
    }

    const response = await fetch(`/api/media-borrowing/renew`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mediaId, renewedEndDate }),
    });

    return response.json();
}