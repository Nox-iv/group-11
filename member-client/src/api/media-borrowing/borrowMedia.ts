import { BorrowingResponse } from "./types/BorrowingResponse";

export const borrowMedia = async (
    mediaId: number,
    userId: number,
    branchId: number,
    startDate: Date, 
    endDate: Date
) : Promise<BorrowingResponse> => {
    if (process.env.NODE_ENV === 'development') {
        return { success: true, errors: [] };
    }

    const response = await fetch(`/api/media-borrowing/borrow`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mediaId, userId, branchId, startDate, endDate }),
    });

    if (response.ok) {
        return { success: true, errors: [] };
    } else {
        const body = await response.json();
        return { success: false, errors: body.errors };
    }
}