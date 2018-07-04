<template>
    <div v-if="!deleted" class="singlePost card">
        <p class="name">{{username}}</p>
        <p class="timePost">created in: {{createdAt}}</p>
        <div v-if="username === loggedUser">
            <a class="edit" @click="editFormFunction()">edit</a>
            <a class="delete" @click="deletePromptFunction()">delete</a>
        </div>
        <div class="contents">
            <div v-if="!editForm && !deletePrompt" v-html="updateInput"></div>
            <form v-if="editForm" method="post" @submit="editPost($event)">
                <vue-editor placeholder="type something..." :editorToolbar="customToolbar" v-model="updateInput"></vue-editor>
                <button class="editButton" id="submitPost" type="submit">edit</button>
                <button class="cancelEditButton" type="button" @click="cancel()">cancel</button>
            </form>
            <div v-if="deletePrompt">
                delete post?
                <button class="editButton" @click="deletePost()">yes</button>
                <button class="cancelEditButton" @click="cancel()">no</button>
            </div>
        </div>
        <div class="upvoteSection" v-if="loggedUser !== username">
            <a v-if="!upvotedthePost" class="heart notUpvoted" @click="addUpvote()"> {{upvotesAmmount}} <i class="icon-upvote"></i></a>
            <a v-if="upvotedthePost" class="heart upvoted" @click="removeUpvote()"> {{upvotesAmmount}} <i class="icon-upvote"></i></a>
            <a v-if="!downvotedthePost" class="heart notUpvoted" @click="addDownvote()"> {{downvotesAmmount}} <i class="icon-downvote"></i></a>
            <a v-if="downvotedthePost" class="heart upvoted" @click="removeDownvote()"> {{downvotesAmmount}} <i class="icon-downvote"></i></a>
        </div>
        <div class="upvoteSection" v-else>
            <p style="width:100%;"> {{upvotesAmmount}} <i class="icon-upvote"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{downvotesAmmount}} <i class="icon-downvote"></i></p>
        </div>
        <div class="answerSection">
            <div class="answerInputPanel">
                Answers
                <form style="margin-top:1rem;" method="post" @submit="addAnswer($event)">
                    <input v-model="addAnswerInput" type="text" placeholder="add a new answer...">
                </form>
            </div>
            <div v-if="answerList.length > 2" class="seeMore">
                <a @click="toggleSeeAnswer()">see {{collapseAnswer ? "less" : "all"}} Answers {{collapseAnswer ? '' : `(${answerList.length})`}}</a>
            </div>
            <answer v-if="answerList.length < 3 || collapseAnswer" v-for="answer in answerList" :key="answer._id" :name="answer.uploader.username" :content="answer.content" :createdAt="answer.createdAt" :answerId="answer._id" :upvotes="answer.upvotes" :downvotes="answer.downvotes"/>
            <answer v-if="answerList.length > 2 && !collapseAnswer"  v-for="answer in latestAnswer" :key="answer._id" :name="answer.uploader.username" :content="answer.content" :createdAt="answer.createdAt" :answerId="answer._id" :upvotes="answer.upvotes" :downvotes="answer.downvotes"/>
        </div>

    </div>
</template>
<script>
import axios from 'axios'
import answer from './answer.vue'
import { VueEditor } from 'vue2-editor'
export default {
  name: 'post',
  components: { answer, VueEditor },
  data () {
    return {
      upvotesAmmount: this.upvotes.length,
      downvotesAmmount: this.downvotes.length,
      upvotedthePost: false,
      downvotedthePost: false,
      loggedUser: localStorage.getItem('username'),
      editForm: false,
      deletePrompt: false,
      deleted: false,
      updateInput: this.content,
      createdAt: '',
      answerList: [],
      addAnswerInput: '',
      latestAnswer: [],
      collapseAnswer: false,
      customToolbar: [
        [{ 'font': [] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }]
      ]
    }
  },
  created () {
    this.getAllAnswers()
    let date = new Date(this.timecreated)
    this.createdAt = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`
    let checkUpvoted = this.upvotes.find(function (object) {
      return object.username === localStorage.getItem('username')
    })
    let checkDownvoted = this.downvotes.find(function (object) {
      return object.username === localStorage.getItem('username')
    })
    if (checkUpvoted) this.upvotedthePost = true
    if (checkDownvoted) this.downvotedthePost = true
  },
  methods: {
    onPostInput: function (event) {
      this.updateInput = event.target.innerText
    },
    getAllAnswers () {
      axios.get('http://localhost:3000/answers/' + this.idPost)
        .then(answersFound => {
          this.answerList = answersFound.data.answersFound ? answersFound.data.answersFound : []
          this.latestAnswer = this.answerList ? [ this.answerList[this.answerList.length - 2], this.answerList[this.answerList.length - 1 ]] : []
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    addUpvote: function () {
      if (this.downvotedthePost) {
        this.downvotedthePost = !this.downvotedthePost
        this.downvotesAmmount--
      }
      this.upvotedthePost = true
      this.upvotesAmmount++
      axios.put('http://localhost:3000/posts/addupvote/' + this.idPost, {}, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
        .then(result => {
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    addDownvote: function () {
      if (this.upvotedthePost) {
        this.upvotedthePost = !this.upvotedthePost
        this.upvotesAmmount--
      }
      this.downvotedthePost = true
      this.downvotesAmmount++
      axios.put('http://localhost:3000/posts/adddownvote/' + this.idPost, {}, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
        .then(result => {
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    cancel () {
      this.deletePrompt = false
      this.editForm = false
    },
    toggleSeeAnswer () {
      this.getAllAnswers()
      this.collapseAnswer = !this.collapseAnswer
    },
    removeUpvote: function () {
      this.upvotedthePost = false
      this.upvotesAmmount--
      axios.put('http://localhost:3000/posts/removeupvote/' + this.idPost, {}, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
        .then(result => {
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    removeDownvote: function () {
      this.downvotedthePost = false
      this.downvotesAmmount--
      axios.put('http://localhost:3000/posts/removedownvote/' + this.idPost, {}, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
        .then(result => {
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    editFormFunction () {
      this.editForm = true
      this.deletePrompt = false
    },
    deletePromptFunction () {
      this.deletePrompt = true
      this.editForm = false
    },
    editPost: function (event) {
      event.preventDefault()
      let updatedContent = {
        content: this.updateInput
      }

      axios.put('http://localhost:3000/posts/' + this.idPost, updatedContent, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
        .then(result => {
          this.cancel()
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    addAnswer: function (event) {
      event.preventDefault()
      let answerRequirement = {
        content: this.addAnswerInput,
        postParentId: this.idPost
      }
      axios.post('http://localhost:3000/answers', answerRequirement, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
        .then(answerMade => {
          this.addAnswerInput = ''
          answerMade.data.result['uploader'] = {
            username: localStorage.getItem('username')
          }
          console.log(answerMade)
          this.answerList.push(answerMade.data.result)
          this.latestAnswer = [ this.answerList[this.answerList.length - 2], this.answerList[this.answerList.length - 1 ]]
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    deletePost: function () {
      axios.delete('http://localhost:3000/posts/' + this.idPost, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
        .then(() => {
          this.deleted = true
        })
        .catch(error => {
          console.log(error.response)
        })
    }

  },
  props: ['username', 'content', 'upvotes', 'idPost', 'timecreated', 'downvotes']
}
</script>
<style lang="scss" scoped>
$hovercolor: rgba(0,0,0,.7);
.singlePost{
    position:relative;
    font-size:1.1rem;
    padding:2rem;
    margin-top:3rem;
    width:100%;
    min-height:30rem;
    .name{
        font-size: 1.5rem;
        text-align:center;
    }
    .timePost{
        text-align:center;
    }
    .contents{
        width:100%;
        min-height:2rem;
        padding:3rem;
        font-size:2rem;
    }
    .upvoteSection{
        width:100%;
        padding:3rem;
        font-size: 1.2rem;
        p{
            width: 2rem;
        }
        .heart{
            font-size:1.5rem;
            margin-right:2rem;
            i{
                margin-right:1rem;
            }
        }
        .upvoted{
            color:red;
            cursor: pointer;
            &:hover{
                color:rgba(0,0,0,.3);
            }
        }
        .notUpvoted{
            color:rgba(0,0,0,.7);
            cursor: pointer;
            &:hover{
                color:rgba(255, 0, 0, 0.4);
            }
        }
    }
    .cancelEditButton{
        border:0;
        background:none;
        cursor: pointer;
        &:hover{
            color:$hovercolor;
        }
    }
    .editButton{
        border:0;
        background:none;
        cursor: pointer;
        &:hover{
            color:$hovercolor;
        }
    }
    .edit{
        cursor: pointer;
        font-size:1.3rem;
        position:absolute;
        top:2rem;
        right:14rem;
        &:hover{
            color:$hovercolor;
        }

    }
    .delete{
        cursor: pointer;
        font-size:1.3rem;
        position:absolute;
        top:2rem;
        right:6rem;
        &:hover{
            color:$hovercolor;
        }
    }
    [contenteditable=true]:focus,[contenteditable=true]:active{
        outline:none
    }

    [contenteditable=true]{
        border-radius:2rem;
        padding: 2rem;
        border: .1rem solid rgba(0,0,0,.2);
        cursor: text;
    }
    .answerSection{
        .seeMore{
            padding: 0 2rem;
            a{
                cursor: pointer;
                &:hover{
                    color:rgba(0,0,0,.7)
                }
            }
        }
        .answerInputPanel{
            border-radius: 3rem;
            padding:2rem;
            font-size:1.3rem;
            input{
                width:100%;
                border:0;
                border-bottom:1px solid rgba(0,0,0,.3);
                &:active, &:focus{
                    outline:none;
                }
            }
        }
    }
}
@media(max-width: 767px){
 .delete{
    right: 2rem !important
 }
 .edit{
    right: 8rem !important;
 }
}
</style>
