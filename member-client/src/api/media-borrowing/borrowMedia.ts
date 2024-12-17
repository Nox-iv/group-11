export const borrowMedia = async (
    mediaId: number,
    userId: number,
    branchId: number,
    startDate: Date, 
    endDate: Date
) => {
    if (process.env.NODE_ENV === 'development') {
        return true;
    }

    const response = await fetch(`/api/media-borrowing/borrow`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mediaId, userId, branchId, startDate, endDate }),
    });

    return response.json();
}