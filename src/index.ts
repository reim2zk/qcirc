import Vue from 'vue';
import {Gate, Hadamal, XGate, OneGate, Circuit, GateType, ControledNot} from './model'

const circuit = new Circuit(5, [])
circuit.gates.push(new ControledNot(circuit, 2, 3, 3))
circuit.gates.push(new Hadamal(circuit, 1, 2))
circuit.gates.push(new XGate(circuit, 1, 4))
circuit.gates.push(new Hadamal(circuit, 2, 0))

let selectedOneGate: Gate | null = null
let partIndex: number = 0
function down(e: MouseEvent) {
    if(!selectedOneGate) {
        const position = circuit.position(e.offsetX)
        const indexQbit = circuit.indexQbit(e.offsetY)
        const res = circuit.findGate(position, indexQbit)
        if(res) {
            selectedOneGate = res.gate
            partIndex = res.index
        }        
    }
}
function move(e: MouseEvent) {
    if(selectedOneGate) {        
        selectedOneGate.setX(e.offsetX, partIndex)
        selectedOneGate.setY(e.offsetY, partIndex)
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
console.log(gateNameTypes)
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
        circuit: Circuit
    },
    methods: {
        move: move,
        down: down,
        up: up
    },
    template: `
    <svg 
        v-bind:width="circuit.width()" 
        v-bind:height="circuit.height()" 
        v-on:mousemove="move"
        v-on:mousedown="down"
        v-on:mouseup="up">
        <line v-for="y in circuit.wireYs()" x1="0" v-bind:y1="y" x2="100" v-bind:y2="y" stroke="black"></line>
        <template v-for="gate in circuit.gates">
            <gate v-bind:gate="gate"></gate>
        </template>
    </svg>
    `
})

Vue.component('gate', {
    props: {
        gate: Gate
    },
    methods: {
        controledNot: function(): ControledNot | null {
            return this.gate instanceof ControledNot ? this.gate : null
        },
        hadamal: function(): Hadamal | null {            
            return this.gate instanceof Hadamal ? this.gate : null
        },
        xGate: function(): XGate | null {
            return this.gate instanceof XGate ? this.gate : null
        }
    },
    template: `
    <controled-not v-if="controledNot()" v-bind:gate="controledNot()"></controled-not>
    <hadamal v-else-if="hadamal()" v-bind:gate="hadamal()"></hadamal>
    <x-gate v-else-if="xGate()" v-bind:gate="xGate()"></x-gate>
    `    
})
Vue.component('controled-not', {
        props: {
            gate: ControledNot
        },
        template: `<svg>
        <line 
            :x1="gate.x()" 
            :x2="gate.x()" 
            :y1="gate.yControl()" 
            :y2="gate.yNot()" 
            stroke="black"/>
        <circle
            :cx="gate.x()"
            :cy="gate.yControl()"
            :r="3"
            fill="black">
        </circle>
        <circle
            :cx="gate.x()"
            :cy="gate.yNot()"
            :r="6"
            stroke="black"
            fill="white">
    </circle>
        </svg>
        `
    })
Vue.component('hadamal', {
    props: {
        gate: Hadamal,
    },    
    template: `<svg>
    <rect
        v-bind:x="gate.rx()" v-bind:y="gate.ry()" 
        v-bind:width="gate.diameter" 
        v-bind:height="gate.diameter"
        fill="yellow"
    >    
    </rect>
    <text 
    :x="gate.x()" :y="gate.y()" :font-size="gate.diameter" 
    text-anchor="middle" dominant-baseline="central"
    style="user-select: none">
    H
</text>
    </svg>
    `
})
Vue.component('x-gate', {
    props: {
        gate: XGate,
    },
    template: `<svg>
    <rect
        v-bind:x="gate.rx()" v-bind:y="gate.ry()" 
        v-bind:width="gate.diameter" v-bind:height="gate.diameter"
        fill="cyan">
    </rect>
    <text 
    :x="gate.x()" :y="gate.y()" :font-size="gate.diameter" 
    text-anchor="middle" dominant-baseline="central"
    style="user-select: none">
        X
    </text>
    </svg>
    `
})

new Vue(
{
    el: '#app',
    data: {
        title: 'he',
        x: 10,
        y: 10,
        circuit: circuit,
        gateNameTypes: gateNameTypes
    },
    filters: {
        strPlus2: function (value: string): string {
            return value + "2"
        }
    },
})
