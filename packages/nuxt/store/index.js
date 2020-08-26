import Vue from 'vue'
import Vuex from 'vuex'

export const state = () => ({
    markdownBlock: {}
})

export const mutations = {
    add(state, text) {
        state.markdownBlock = {
            ...state.markdownBlock,
            title: text.title,
            done: false
        }
    }
}