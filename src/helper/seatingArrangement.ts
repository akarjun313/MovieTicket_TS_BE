import { ISeat } from "@interfaces/interfaces.js"

export const generateSeatingArrangement = (rows: number, cols: number): ISeat[] => {
    const seats: ISeat[] = []
    for(let i= 0; i < rows; i++) {
        const rowLetter = String.fromCharCode(65 + i)
        for(let j = 1; j <= cols; j++) {
            seats.push({
                seatNumber: `${rowLetter}${j}`,
                status: 'AVAILABLE'
            } as unknown as ISeat)
        }
    }
    return seats
}