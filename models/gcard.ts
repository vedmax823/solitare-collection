export enum EnumValue {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
    SIX = 6,
    SEVEN = 7,
    EIGHT = 8,
    NINE = 9,
    TEN = 10,
    JACK = 11,
    QWEEN = 12,
    KING = 13
}

export enum EnumSuit {
    DIAMONDS = 'diamonds',
    HEARTS = 'hearts',
    CLUBS = 'clubs',
    SPADES = 'spades'
}



export class GCard{
    value : EnumValue
    suit : EnumSuit
    isOpen : boolean
    top : number
    left : number
    width : number
    height : number

    constructor (value : EnumValue, suit : EnumSuit){
        this.value = value
        this.suit = suit
        this.isOpen = false
        this.top = 0
        this.left = 0 
        this.width = 0
        this.height = 0
    }

    setOpen(){
        this.isOpen = true 
    }

    setClose(){
        this.isOpen = false
    }

    setTopLeft(top : number, left : number, width : number, height : number){
        this.top = top
        this.left = left
        this.width = width
        this.height = height
    }
}