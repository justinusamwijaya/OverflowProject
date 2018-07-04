<template>
    <div v-if="!deleted" class="answerPanel">
        <div v-if="!editMode" class="answerHeader">
            <h3>{{name}}</h3>
            <p>{{timeCreated}}</p>
        </div>
        <p v-if="!editMode" style="font-size:1.3rem;">
            {{valueContent}}
        </p>
        <form v-if="editMode" method="post" @submit="editComment($event)">
            <input v-model="valueContent" class="editInput" type="text">
        </form>
        <div v-if="name === loggedUser">
            <button v-if="!deletePrompt" class="answerButton editOne" @click="toggleEditMode()">{{editMode? "cancel" : "edit"}}</button>
            <button v-if="!editMode && !deletePrompt" class="answerButton deleteOne" @click="toggledeletePrompt()">delete</button>
        </div>
        <div v-if="deletePrompt">
            delete answer?
            <button class="answerButton" @click="deleteComment()">yes</button>
            <button class="answerButton" @click="toggledeletePrompt()">no</button>
        </div>
        <div class="upvoteSection" v-if="loggedUser !== name">
            <a v-if="!upvotedthePost" class="heart notUpvoted" @click="addUpvote()"> {{upvotesAmmount}} <i class="icon-upvote"></i></a>
            <a v-if="upvotedthePost" class="heart upvoted" @click="removeUpvote()"> {{upvotesAmmount}} <i class="icon-upvote"></i></a>
            <a v-if="!downvotedthePost" class="heart notUpvoted" @click="addDownvote()"> {{downvotesAmmount}} <i class="icon-downvote"></i></a>
            <a v-if="downvotedthePost" class="heart upvoted" @click="removeDownvote()"> {{downvotesAmmount}} <i class="icon-downvote"></i></a>
        </div>
        <div class="upvoteSection" v-else>
            <p> {{upvotesAmmount}} <i class="icon-upvote"></i> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{downvotesAmmount}} <i class="icon-downvote"></i></p>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
  data () {
    return {
      upvotesAmmount: this.upvotes.length,
      downvotesAmmount: this.downvotes.length,
      upvotedtheComment: false,
      downvotedtheComment: false,
      timeCreated: '',
      loggedUser: localStorage.getItem('username'),
      editMode: false,
      valueContent: this.content,
      deletePrompt: false,
      deleted: false
    }
  },
  created () {
    let date = new Date(this.createdAt)
    this.timeCreated = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`
    let checkUpvoted = this.upvotes.find(function (object) {
      return object.username === localStorage.getItem('username')
    })
    let checkDownvoted = this.downvotes.find(function (object) {
      return object.username === localStorage.getItem('username')
    })
    if (checkUpvoted) this.upvotedtheComment = true
    if (checkDownvoted) this.downvotedtheComment = true
  },
  methods: {
    toggleEditMode () {
      this.editMode = !this.editMode
    },
    toggledeletePrompt () {
      this.deletePrompt = !this.deletePrompt
    },
    editComment (event) {
      event.preventDefault()
      let updatedComment = {
        content: this.valueContent
      }
      axios.put('http://localhost:3000/answers/' + this.answerId, updatedComment, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
        .then(() => {
          this.editMode = false
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    deleteComment () {
      axios.delete('http://localhost:3000/answers/' + this.answerId, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
        .then(() => {
          this.deleted = true
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    addUpvote: function () {
      if (this.downvotedtheComment) {
        this.downvotedtheComment = !this.downvotedtheComment
        this.downvotesAmmount--
      }
      this.upvotedtheComment = true
      this.upvotesAmmount++
      axios.put('http://localhost:3000/answers/addupvote/' + this.answerId, {}, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
        .then(result => {
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    addDownvote: function () {
      if (this.upvotedtheComment) {
        this.upvotedtheComment = !this.upvotedtheComment
        this.upvotesAmmount--
      }
      this.downvotedtheComment = true
      this.downvotesAmmount++
      axios.put('http://localhost:3000/answers/adddownvote/' + this.answerId, {}, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
        .then(result => {
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    removeUpvote: function () {
      this.upvotedtheComment = false
      this.upvotesAmmount--
      axios.put('http://localhost:3000/answers/removeupvote/' + this.answerId, {}, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
        .then(result => {
        })
        .catch(error => {
          console.log(error.response)
        })
    },
    removeDownvote: function () {
      this.downvotedtheComment = false
      this.downvotesAmmount--
      axios.put('http://localhost:3000/answers/removedownvote/' + this.answerId, {}, { headers: { authorization: 'bearer ' + localStorage.getItem('token') } })
        .then(result => {
        })
        .catch(error => {
          console.log(error.response)
        })
    }
  },
  props: ['answerId', 'name', 'content', 'createdAt', 'upvotes', 'downvotes']

}
</script>
<style lang="scss" scoped>
    .answerPanel{
        position:relative;
        margin-top:1rem;
        border-radius: 3rem;
        padding:2rem 3rem;
        .answerHeader{
            position:relative;
            border-bottom:1px solid rgba(0,0,0,.3);
            p{
                position:absolute;
                top:0;
                right:0;
            }
        }
        .answerButton{
            border:0;
            background:none;
            cursor: pointer;
            &:hover{
                color:rgba(0,0,0,.7)
            }
            &:active,&:focus{
                outline:none;
            }
            &:active{
                color:rgba(0,0,0,.9)
            }
        }
        .upvoteSection{
            width:100%;
            font-size: 1rem;
            .heart{
                font-size:1rem;
                margin-right:2rem;
                i{
                    margin-right:.5rem;
                }
            }
            .upvoted{
                color:red;
                cursor: pointer;
                &:hover{
                    color:rgba(0,0,0,.7);
                }
            }
            .notUpvoted{
                color:rgba(0,0,0,.7);
                cursor: pointer;
                &:hover{
                    color:red;
                }
            }
        }
        .deleteOne{
            position:absolute;
            bottom:0;
            right:3rem;
        }
        .editOne{
            position:absolute;
            bottom:0;
            right:7rem;
        }
        .editInput{
            font-size:1.3rem;
            border:0;
            margin:1rem;
            border-bottom:.1rem solid rgba(0,0,0,.7);
            width:100%;
            &:active, &:focus{
                outline: none;
            }
        }
    }
</style>
