export enum GateType {H, X, Y, Z, CN}
export enum QbitType {Q0, Q1}

export class Qbit {
    type: QbitType  
    measure: boolean
    constructor(type: QbitType, measure: boolean) {
        this.type = type
        this.measure = measure
    }
    swapQbit(): void {
        switch(this.type) {
            case QbitType.Q0:
                this.type = QbitType.Q1
                break
            case QbitType.Q1:
                this.type = QbitType.Q0
                break
        }
    }
    swapMeasure(): void {
        this.measure = !this.measure
    }
}

export class Circuit {
    numQbit: number
    numPosition: number = 10
    gates: Gate[]
    qbits: Qbit[]
    constructor(gates: Gate[], qbits: Qbit[]) {
        this.numQbit = qbits.length
        this.gates = gates
        this.qbits = qbits
    }
    findGate(position: number, indexQbit: number): {gate: Gate, index: number} | null {
        for(const gate of this.gates) {
            const index = gate.findPart(position, indexQbit)
            if(index != null) {
                return {gate: gate, index: index}
            }
        }
        return null
    }
    emptyGate(type: GateType): Gate {
        let g: Gate
        switch(type) {
            case GateType.H: g = new Hadamal(0, 0); break
            case GateType.X: g = new XGate(0, 0); break
            case GateType.Y: g = new YGate(0, 0); break
            case GateType.Z: g = new ZGate(0, 0); break
            case GateType.CN: g = new ControledNot(0, 1, 0); break
        }
        return g
    }
}

export class Gate {
    type: GateType
    constructor(type: GateType) {
        this.type = type
    }
    findPart(position: number, indexQbit: number): number | null {
        console.log("do not call")
        return null
    }
    setPositionIndexQbit(position: number, indexQbit: number, partIndex: number): void {
        console.log("do not call")
    }
}

export class ControledNot extends Gate {
    indexQbitControl: number
    indexQbitNot: number
    position: number
    static indexControl = 1
    static indexTarget = 2    
    constructor(indexQbit1: number, indexQbit2: number, position: number) {
        super(GateType.CN)
        this.indexQbitControl = indexQbit1
        this.indexQbitNot = indexQbit2
        this.position = position
    }
    findPart(position: number, indexQbit: number): number | null {
        if(this.indexQbitControl == indexQbit && this.position == position) {
            return ControledNot.indexControl
        } else if(this.indexQbitNot == indexQbit && this.position == position) {
            return ControledNot.indexTarget
        } else {
            return null
        }
    }
    setPositionIndexQbit(position: number, indexQbit: number, partIndex: number): void {
        this.position = position
        if(partIndex == ControledNot.indexControl) {
            this.indexQbitControl = indexQbit
        } else if(partIndex == ControledNot.indexTarget) {
            this.indexQbitNot = indexQbit
        }
    }
}
export class OneGate extends Gate {
    indexQbit: number
    position: number
    constructor(type: GateType, indexQbit:number, position: number) {
        super(type)
        this.indexQbit = indexQbit
        this.position = position
    }
    findPart(position: number, indexQbit: number): number | null {
        if(this.indexQbit == indexQbit && this.position == position) {
            return 1
        } else {
            return null
        }
    }
    setPositionIndexQbit(position: number, indexQbit: number, partIndex: number): void {
        this.position = position
        this.indexQbit = indexQbit
    }
}

export class Hadamal extends OneGate {    
    constructor(indexQbit: number, position: number) {
        super(GateType.H, indexQbit, position)
    }    
}

export class XGate extends OneGate {
    constructor(indexQbit: number, position: number) {
        super(GateType.X, indexQbit, position)
    }    
}

export class YGate extends OneGate {
    constructor(indexQbit: number, position: number) {
        super(GateType.Y, indexQbit, position)
    }    
}

export class ZGate extends OneGate {
    constructor(indexQbit: number, position: number) {
        super(GateType.Z, indexQbit, position)
    }    
}

