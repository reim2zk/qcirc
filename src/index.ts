import Vue from 'vue';
import {Gate, Hadamal, XGate, Circuit} from './model'

function selectGate(e: any) {
    console.log("Select")

}

Vue.component('circuit', {
    props: {
        value: Circuit
    },
    template: `
    <svg v-bind:width="value.width()" v-bind:height="value.height()">
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
        hadamal: function(): Hadamal | null {            
            if (this.gate instanceof Hadamal) {
                return this.gate
            } else {
                return null
            }
        },
        xGate: function(): XGate | null {
            if (this.gate instanceof XGate) {
                return this.gate
            } else {
                return null
            }
        }
    },
    template: `
    <hadamal v-if="hadamal()" v-bind:gate="hadamal()"></hadamal>
    <x-gate v-else-if="xGate()" v-bind:gate="xGate()"></x-gate>
    `    
})

Vue.component('hadamal', {
    props: {
        gate: Hadamal,
    },    
    methods: {
        selectGate: selectGate,
    },
    template: `<rect
        v-bind:x="gate.x()" v-bind:y="gate.y()" 
        v-bind:width="gate.diameter" v-bind:height="gate.diameter"
        v-bind:stroke="gate.color"
        fill="yellow"
        v-on:click="selectGate"
    ></rect>
    `
})
Vue.component('x-gate', {
    props: {
        gate: XGate,
    },
    methods: {
        selectGate: selectGate,
    },
    template: `<rect
        v-bind:x="gate.x()" v-bind:y="gate.y()" 
        v-bind:width="gate.diameter" v-bind:height="gate.diameter"
        v-bind:stroke="gate.color"
        fill="white"
        v-on:click="selectGate"
    ></rect>
    `
})

const gates: Gate[] = [
    new Hadamal(0, 0),
    new Hadamal(1, 0),
    new Hadamal(2, 0),
    new Hadamal(1, 1),
    new Hadamal(1, 2),
    new XGate(1, 4)
]
const circuit = new Circuit(5, gates)

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
    methods: {
        selectGate: function (event: any, gate: Gate): void {
            console.log("my click")
            console.log(gate)
            console.log(event)
            console.log(event.toElement)
            this.x += 1
        }
    }
})
