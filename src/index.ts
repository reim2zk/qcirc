import Vue from 'vue';
import {Gate, Hadamal, XGate} from './model'

function selectGate(e: any) {
    console.log("Select")

}

const gates: Gate[] = [
    new Hadamal(0, 1),
    new Hadamal(1, 2),
    new XGate(1, 4)
]
Vue.component('hadamal', {
    props: {
        gate: Hadamal,
    },    
    methods: {
        selectGate: selectGate,
    },
    template: `<rect
        v-bind:x="gate.x()" v-bind:y="gate.y()" 
        v-bind:width="gate.width" v-bind:height="gate.height"
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
        v-bind:width="gate.width" v-bind:height="gate.height"
        v-bind:stroke="gate.color"
        fill="white"
        v-on:click="selectGate"
    ></rect>
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

new Vue(
{
    el: '#app',
    data: {
        title: 'he',
        x: 10,
        y: 10,
        gates: gates
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
