<template>
    <b-col class="errorBanner" cols=12 offset-md=2 md=8 v-if="!closed">
        <button @click="closeBanner" class="closeBanner">x</button>
        <p>{{message}}</p>
    </b-col>
</template>
<script>
export default {
  name: 'errorHandlers',
  components: {},
  data () {
    return {
      closed: false
    }
  },
  props: ['message'],
  methods: {
    closeBanner: function () {
      this.closed = true
    }
  }
}
</script>
<style lang="scss" scoped>
$backgroundColor : #6700dd;
$backgroundColor2 : rgba(255, 255, 255, .404);
$backgroundColor3 : rgba(0,0,0,.3);
$backgroundColor4 : rgba(175, 1, 255, 0.842);
$blank: rgba(0,0,0,0);

.errorBanner{
    position: relative;
    height:5rem;
    z-index: 7000;
    background-color:$backgroundColor4;
    margin-bottom:.2rem;
    font-size:1.5rem;
    display:flex;
    justify-content: center;
    align-items: center;
    padding:.5rem;
    border-radius: .7rem;
    p{
        color:white
    }
    .closeBanner{
        background-color:$blank;
        color:white;
        position:absolute;
        border:0;
        top:0;
        right:0;
        cursor: pointer;
        &:hover{
            color:$backgroundColor;
        }
    }
}

</style>
