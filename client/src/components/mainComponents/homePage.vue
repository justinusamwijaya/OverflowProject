<template>
    <b-row>
        <b-col class="posts" cols=12 offset-md=2 md=8>
            <div v-if="$store.state.loggedIn" class="addNewPost">
                <form method="post" @submit="addPost($event)">
                    <vue-editor class="editor" placeholder="type something..." :editorToolbar="customToolbar" v-model="addPostInput"></vue-editor>
                    <button class="col-xs-12" id="submitPost" type="submit">add post</button>
                </form>
            </div>
            <post v-for="post in allPosts" :key="post._id" :idPost="post._id" :username="post.uploader.username" :content="post.content" :downvotes="post.downvotes" :upvotes="post.upvotes" :timecreated="post.createdAt"/>
        </b-col>
    </b-row>
</template>
<script>
import axios from 'axios'
import post from '../subComponents/post.vue'
import { VueEditor } from 'vue2-editor'
export default {
  name: 'homePage',
  components: { post, VueEditor },
  data () {
    return {
      addPostInput: '',
      allPosts: [],
      customToolbar: [
        [{ 'font': [] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }]
      ]
    }
  },
  created () {
    if (this.status === 'home') {
      this.getAllPosts()
    } else {
      this.getAllPosts('profile')
    }
  },
  props: ['status'],
  methods: {
    onPostInput: function (event) {
      this.addPostInput = event.target.innerText
    },
    getAllPosts: function (status) {
      status = status ? 'getfromid/' + localStorage.getItem('id') : ''
      axios.get('http://localhost:3000/posts/' + status)
        .then(result => {
          this.allPosts = result.data.postsFound.reverse()
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    addPost: function (event) {
      event.preventDefault()
      let newPost = {
        content: this.addPostInput
      }
      axios.post('http://localhost:3000/posts', newPost, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
        .then(result => {
          this.addPostInput = ''
          result.data.result['uploader'] = {
            username: localStorage.getItem('username')
          }
          this.allPosts.splice(0, 0, result.data.result)
        })
        .catch(error => {
          console.log(error.response)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
$primaryColor : #6700dd;
.editor{
    margin-bottom:1rem;
}
.posts{
    padding-top:7rem !important;
    padding: 5rem 3rem;
}
.addNewPost{
    border-radius:1.5rem;
    padding:2rem;
    margin-top:3rem;
    width:100%;
    min-height:20rem;
}
[contenteditable=true]:empty:before{
content: attr(content);
color: rgba(0,0,0,0.2);
display: block;
}

[contenteditable=true]:focus,[contenteditable=true]:active{
    outline:none
}

[contenteditable=true]{
    font-size: 1.7em;
    cursor: text;
}
#submitPost{
    cursor: pointer;
    font-size:1.3rem;
    width:100%;
    background-color:$primaryColor;
    color:white;
    height:4rem;
    border:0;
}
</style>
