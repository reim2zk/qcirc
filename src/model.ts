export enum GateType {H, X, CN}
export function gateTypeName(gateType: GateType): string | null{
    const map = new Map([[GateType.H, "H"], [GateType.X, "X"]])
    const res = map.get(gateType)
    return res ? res : null
}


export class Circuit {
    numQbit: number
    numPosition: number = 10
    gates: Gate[]
    unitWidth: number = 20
    unitHeight: number = 30
    constructor(numQBit: number, gates: Gate[]) {
        this.numQbit = numQBit
        this.gates = gates
    }
    width(): number { return this.numPosition * this.unitWidth }
    height(): number { return (this.numQbit+1) * this.unitHeight }    
    wireYs(): number[] { 
        let ys = []
        for(let i = 0; i < this.numQbit; i++) {
            ys.push(this.y(i))
        }
        return ys
    }
    x(position: number): number { return (position+0.5) * this.unitWidth }
    y(indexQbit: number): number { return (indexQbit+0.5) * this.unitHeight }
    position(x: number): number { return Math.floor(x / this.unitWidth) }
    indexQbit(y: number): number { return Math.floor(y / this.unitHeight) }
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
            case GateType.H: g = new Hadamal(this, 0, 0); break
            case GateType.X: g = new XGate(this, 0, 0); break
            case GateType.CN: g = new ControledNot(this, 0, 1, 0); break
        }
        return g
    }
}

export class Gate {
    type: GateType
    readonly circuit: Circuit
    constructor(type: GateType, circuit: Circuit) {
        this.type = type
        this.circuit = circuit
    }
    findPart(position: number, indexQbit: number): number | null {
        console.log("do not call")
        return null
    }
    setX(x: number, partIndex: number): void { console.log("do not call") }
    setY(y: number, partIndex: number): void { console.log("do not call") }
}

export class ControledNot extends Gate {
    indexQbitControl: number
    indexQbitNot: number
    position: number
    radiusControl: number
    radiusTarget: number
    static indexControl = 1
    static indexTarget = 2    
    constructor(circuit: Circuit, indexQbit1: number, indexQbit2: number, position: number) {
        super(GateType.CN, circuit)
        this.indexQbitControl = indexQbit1
        this.indexQbitNot = indexQbit2
        this.position = position
        const d = Math.min(this.circuit.unitHeight, this.circuit.unitWidth)
        this.radiusControl = Math.round(d * 0.15)
        this.radiusTarget = Math.round(d * 0.4)
    }
    x(): number { return this.circuit.x(this.position) } 
    yControl(): number { return this.circuit.y(this.indexQbitControl) }
    yNot(): number { return this.circuit.y(this.indexQbitNot) }
    findPart(position: number, indexQbit: number): number | null {
        if(this.indexQbitControl == indexQbit && this.position == position) {
            return ControledNot.indexControl
        } else if(this.indexQbitNot == indexQbit && this.position == position) {
            return ControledNot.indexTarget
        } else {
            return null
        }
    }
    setX(x: number, partIndex: number): void {
        this.position = this.circuit.position(x)
    }
    setY(y: number, partIndex: number): void {
        if(partIndex == ControledNot.indexControl) {
            this.indexQbitControl = this.circuit.indexQbit(y)
        } else if(partIndex == ControledNot.indexTarget) {
            this.indexQbitNot = this.circuit.indexQbit(y)
        }
    }
}
export class OneGate extends Gate {
    indexQbit: number
    position: number
    diameter: number
    constructor(type: GateType, circuit: Circuit, indexQbit:number, position: number) {
        super(type, circuit)
        this.indexQbit = indexQbit
        this.position = position
        this.diameter = Math.round(Math.min(this.circuit.unitHeight, this.circuit.unitWidth) * 0.7)
    }
    width(): number { return this.circuit.unitWidth }
    height(): number { return this.circuit.unitHeight }
    x(): number { return this.circuit.x(this.position) } 
    y(): number { return this.circuit.y(this.indexQbit) }
    findPart(position: number, indexQbit: number): number | null {
        if(this.indexQbit == indexQbit && this.position == position) {
            return 1
        } else {
            return null
        }
    }
    setX(x: number): void { 
        this.position = this.circuit.position(x)
    } 
    setY(y: number): void { 
        this.indexQbit = this.circuit.indexQbit(y)
    }
}

export class Hadamal extends OneGate {    
    constructor(circuit: Circuit, indexQbit: number, position: number) {
        super(GateType.H, circuit, indexQbit, position)
    }    
}

export class XGate extends OneGate {
    constructor(circuit: Circuit, indexQbit: number, position: number) {
        super(GateType.X, circuit, indexQbit, position)
    }    
}
