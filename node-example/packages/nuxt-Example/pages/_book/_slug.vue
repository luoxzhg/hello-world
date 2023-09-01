<template lang="pug">
div
    h1 动态URL页面
    NuxtLink(to="/") Home
    p {{book}}/{{slug}}
    div
        p post: {{post}}
</template>

<script>
export default {
    data() {
        return {
            post: null
        }
    },

    async asyncData(context) {
        console.log('asyncData called')
        const book = context.params.book
        const slug = context.params.slug
        return {book, slug}
    },

    async fetch() {
        console.log('fetch called')
        const res = await fetch('https://api.nuxtjs.dev/posts/1')
        this.post = await res.json()
    },
    fetchOnServer: false
}
</script>
