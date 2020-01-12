import Vue from 'vue';
import {Gate, CNot, Hadamal, XGate, ControlGate, NotGate, OneGate, Circuit} from './model'

let selectedOneGate: OneGate | null = null
function down(e: MouseEvent) {
    if(!selectedOneGate) {        
        selectedOneGate = circuit.findOneGate(e.offsetX, e.offsetY)
    }
}
function move(e: MouseEvent) {
    if(selectedOneGate) {
        selectedOneGate.setX(e.offsetX)
        selectedOneGate.setY(e.offsetY)
    }
}
function up(e: MouseEvent) {
    if(selectedOneGate) {
        selectedOneGate = null
    }
}

Vue.component('circuit', {
    props: {
        value: Circuit
    },
    methods: {
        move: move,
        down: down,
        up: up
    },
    template: `
    <svg 
        v-bind:width="value.width()" 
        v-bind:height="value.height()" 
        v-on:mousemove="move"
        v-on:mousedown="down"
        v-on:mouseup="up">
        <line v-for="y in value.wireYs()" x1="0" v-bind:y1="y" x2="100" v-bind:y2="y" stroke="black"></line>
        <template v-for="gate in value.gates">
            <gate v-bind:gate="gate"></gate>
        </template>
    </svg>
    `
})

Vue.component('gate', {
    props: {
        gate: Gate,
    },
    methods: {
        cnot: function(): CNot | null {
            return this.gate instanceof CNot ? this.gate : null
        },
        notGate: function(): NotGate | null {
            return this.gate instanceof NotGate ? this.gate : null
        },
        control: function(): ControlGate | null {
            return this.gate instanceof ControlGate ? this.gate : null
        },
        hadamal: function(): Hadamal | null {            
            return this.gate instanceof Hadamal ? this.gate : null
        },
        xGate: function(): XGate | null {
            return this.gate instanceof XGate ? this.gate : null
        }
    },
    template: `
    <cnot v-if="cnot()" v-bind:gate="cnot()"></cnot>
    <not-gate v-else-if="notGate()" v-bind:gate="notGate()"></not-gate>
    <control-gate v-else-if="control()" v-bind:gate="control()"></control-gate>
    <hadamal v-else-if="hadamal()" v-bind:gate="hadamal()"></hadamal>
    <x-gate v-else-if="xGate()" v-bind:gate="xGate()"></x-gate>
    `    
})

Vue.component('cnot', {
    props: {
        gate: CNot
    },
    template: `<svg>
    <line 
        :x1="gate.controlGate.x()" 
        :x2="gate.notGate.x()" 
        :y1="gate.controlGate.y()" 
        :y2="gate.notGate.y()" 
        stroke="black"/>
    <gate v-bind:gate="gate.controlGate"></gate>
    <gate v-bind:gate="gate.notGate"></gate>
    </svg>
    `
})
Vue.component('control-gate', {
    props: {
        gate: ControlGate,
    },    
    template: `<rect
        v-bind:x="gate.rx()" v-bind:y="gate.ry()" 
        v-bind:width="gate.diameter" 
        v-bind:height="gate.diameter"
        stroke="black"
        fill="green"
    ></rect>
    `
})
Vue.component('not-gate', {
    props: {
        gate: OneGate,
    },
    template: `<rect
        v-bind:x="gate.rx()" v-bind:y="gate.ry()" 
        v-bind:width="gate.diameter" 
        v-bind:height="gate.diameter"
        stroke="black"
        fill="pink"
    ></rect>
    `
})
Vue.component('hadamal', {
    props: {
        gate: Hadamal,
    },    
    template: `<rect
        v-bind:x="gate.rx()" v-bind:y="gate.ry()" 
        v-bind:width="gate.diameter" 
        v-bind:height="gate.diameter"
        stroke="black"
        fill="yellow"
    ></rect>
    `
})
Vue.component('x-gate', {
    props: {
        gate: XGate,
    },
    template: `<rect
        v-bind:x="gate.rx()" v-bind:y="gate.ry()" 
        v-bind:width="gate.diameter" v-bind:height="gate.diameter"
        stroke="black"
        fill="white"
    ></rect>
    `
})

const circuit = new Circuit(5, [])
circuit.gates.push(new CNot(circuit, 0, 1, 0))
circuit.gates.push(new Hadamal(circuit, 1, 2))
circuit.gates.push(new XGate(circuit, 1, 4))
circuit.gates.push(new Hadamal(circuit, 2, 0))

new Vue(
{
    el: '#app',
    data: {
        title: 'he',
        x: 10,
        y: 10,
        circuit: circuit
    },
    filters: {
        strPlus2: function (value: string): string {
            return value + "2"
        }
    },
})
