import Vue from 'vue';
import {Gate, Hadamal, XGate, OneGate, Circuit, GateType, ControledNot} from './model'

class CircuitView {
    unitWidth: number
    unitHeight: number
    gateRadius: number
    dotRadius: number
    constructor(unitWidth: number, unitHeight: number, gateRadius: number) {
        this.unitHeight = unitHeight
        this.unitWidth = unitWidth
        this.gateRadius = gateRadius
        this.dotRadius = gateRadius*0.3
    }
    position(x: number): number { 
        return Math.floor(x / this.unitWidth) 
    }
    indexQbit(y: number): number { 
        return Math.floor(y / this.unitHeight) 
    }
    x(position: number): number { 
        return (position + 0.5) * this.unitWidth 
    }
    y(indexQbit: number): number { 
        return (indexQbit + 0.5) * this.unitHeight 
    }    
}

const circuit = new Circuit(5, [])
circuit.gates.push(new ControledNot(circuit, 2, 3, 3))
circuit.gates.push(new Hadamal(circuit, 1, 2))
circuit.gates.push(new XGate(circuit, 1, 4))
circuit.gates.push(new Hadamal(circuit, 2, 0))
const circuitView = new CircuitView(20, 30, 10)

let selectedOneGate: Gate | null = null
let partIndex: number = 0
function down(e: MouseEvent) {
    if(!selectedOneGate) {
        const position = circuitView.position(e.offsetX)
        const indexQbit = circuitView.indexQbit(e.offsetY)
        const res = circuit.findGate(position, indexQbit)
        if(res) {
            selectedOneGate = res.gate
            partIndex = res.index
        }        
    }
}
function move(e: MouseEvent) {
    if(selectedOneGate) {
        const pos = circuitView.position(e.offsetX)
        const iqb = circuitView.indexQbit(e.offsetY)
        selectedOneGate.setPositionIndexQbit(pos, iqb, partIndex)
    }
}
function up(e: MouseEvent) {
    if(selectedOneGate) {
        selectedOneGate = null
    }
}
function add(gateType: GateType) {
    if(!selectedOneGate) {
        const gate = circuit.emptyGate(gateType)
        if(gate instanceof OneGate) {
            selectedOneGate = gate
        }
        circuit.gates.push(gate)
    }
}

export class GateNameTypes {
    values: {name: string, type: GateType}[]
    static default(): GateNameTypes {
        const values = []
        values.push({name: "H", type: GateType.H})
        values.push({name: "X", type: GateType.X})
        values.push({name: "CN", type: GateType.CN})
        return new GateNameTypes(values)
    }
    constructor(values: {name: string, type: GateType}[]) {
        this.values = values
    }
}
const gateNameTypes = GateNameTypes.default()
Vue.component('circuit-ui', {
    data: function() {
        return {
            gateNameTypes: gateNameTypes
        }
    },
    methods: {
        add: add
    },
    template: `
    <span>
        <button v-for="nameType in gateNameTypes.values" 
        v-on:click="add(nameType.type)">
        {{nameType.name}}
        </button>        
    </span>
    `
})

Vue.component('circuit', {
    props: {
        circuit: Circuit,
        circuitView: CircuitView
    },
    methods: {
        move: move,
        down: down,
        up: up,
        width: function(): number { return circuit.numPosition * circuitView.unitWidth },
        height: function(): number { return (circuit.numQbit+1) * circuitView.unitHeight },
        wireYs: function(): number[] {
            let ys = []
            for(let i = 0; i < circuit.numQbit; i++) {
                ys.push(circuitView.y(i))
            }
            return ys
        },
        getCircuitView: function(): CircuitView { return circuitView },
    },
    template: `
    <svg 
        v-bind:width="width()" 
        v-bind:height="height()" 
        v-on:mousemove="move"
        v-on:mousedown="down"
        v-on:mouseup="up">
        <line v-for="y in wireYs()" x1="0" v-bind:y1="y" x2="100" v-bind:y2="y" stroke="black"></line>
        <template v-for="gate in circuit.gates">
            <gate :gate="gate" :circuitView="getCircuitView()"></gate>
        </template>
    </svg>
    `
})

Vue.component('gate', {
    props: {
        gate: Gate,
        circuitView: CircuitView
    },
    methods: {
        controledNot: function(): ControledNot | null {
            return this.gate instanceof ControledNot ? this.gate : null
        },
        oneGate: function(): OneGate | null {
            return this.gate instanceof OneGate ? this.gate : null
        },
        getCircuitView: function(): CircuitView { return circuitView },
    },
    template: `
    <controled-not v-if="controledNot()" 
        :gate="controledNot()"
        :radiusControl="circuitView.gateRadius * 0.4"
        :radiusTarget="circuitView.gateRadius"
        :circuitView="getCircuitView()"
        >
    </controled-not>    
    <one-gate v-else-if="oneGate()" 
        :gate="oneGate()"
        :diameter="circuitView.gateRadius * 2"
        :circuitView="getCircuitView()"
        >
    </one-gate>
    `    
})
Vue.component('controled-not', {
        props: {
            gate: ControledNot,
            circuitView: CircuitView
        },
        methods: {
            x: function(): number { 
                return circuitView.x(this.gate.position)
            },
            yControl: function(): number { 
                return circuitView.y(this.gate.indexQbitControl) 
            },
            yNot: function(): number { 
                return circuitView.y(this.gate.indexQbitNot)
            },
        },
        template: `<svg>
        <line 
            :x1="x()" 
            :x2="x()" 
            :y1="yControl()" 
            :y2="yNot()" 
            stroke="black"/>
        <circle
            :cx="x()"
            :cy="yControl()"
            :r="circuitView.dotRadius"
            fill="black">
        </circle>
        <circle
            :cx="x()"
            :cy="yNot()"
            :r="circuitView.gateRadius"
            stroke="black"
            fill="white">
        </circle>
        <text 
            :x="x()" :y="yNot()-1" 
            :font-size="circuitView.radiusGate*2" 
            text-anchor="middle" 
            dominant-baseline="central"
            style="user-select: none">
            +
        </text>
    </svg>
        `
    })
Vue.component('one-gate', {
        props: {
            gate: OneGate,
            diameter: Number,
            circuitView: CircuitView
        },
        methods: {
            color: function(): string {
                switch(this.gate.type) {
                    case GateType.H: return "cyan"; break
                    case GateType.X: return "yellow"; break
                }
                return "white"
            },
            text: function(): string {
                switch(this.gate.type) {
                    case GateType.H: return "H"; break
                    case GateType.X: return "X"; break
                }
                return "NotFound"
            },
            x: function(): number { 
                return this.circuitView.x(this.gate.position)
            },
            y: function(): number { return this.circuitView.y(this.gate.indexQbit) }
        },
        template: `<svg>
        <rect
            v-bind:x="x() - diameter / 2"
            v-bind:y="y() - diameter / 2" 
            v-bind:width="diameter" 
            v-bind:height="diameter"
            :fill="color()"
        >    
        </rect>
        <text 
            :x="x()" :y="y()" :font-size="diameter" 
            text-anchor="middle" dominant-baseline="central"
            style="user-select: none">
            {{ text() }}
        </text>
        </svg>
        `
    })

new Vue(
{
    el: '#app',
    data: {
        circuit: circuit,
        circuitView: circuitView,
        gateNameTypes: gateNameTypes
    }
})
