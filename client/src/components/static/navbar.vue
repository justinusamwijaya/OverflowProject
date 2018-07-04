<template>
    <div>
        <nav>
            <div v-if="$store.state.loggedIn" class="brand">
                <a href="/">
                    <i class="icon-juddit-logo">

                    </i>
                </a>
            </div>
            <div v-if="$store.state.loggedIn" class="rightnav">
                <router-link class="Loginmenu" :to="{path:'/profile'}" tag="a"><i class="icon-Untitled-1"></i> <span style="margin-left:1rem;">{{ $store.state.username }}</span></router-link>
                <a class="Loginmenu" style="margin-left:2rem;" @click="logout()">logout</a>
            </div>
        </nav>
    </div>
</template>
<script>
export default {
  methods: {
    logout: function () {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('id')
      this.$store.state.loggedIn = false
      window.location.href = '/'
    }
  }
}
</script>
<style lang="scss" scoped>
$primaryColor : #6700dd;
nav{
    z-index: 5888;
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:7rem;
    background-color:$primaryColor;
    display:flex;
    justify-content: center;
    .brand{
        height:100%;
        padding: 1rem 5rem;
        width:25%;
        display:flex;
        align-items: center;
        justify-content: flex-start;
        a{
            color:white;
            font-size:5rem;
            &:hover{
                text-decoration: none;
            }
        }
    }
    .rightnav{
        position:relative;
        height:100%;
        width:75%;
        padding: 1rem 5rem;
        display:flex;
        align-items: center;
        justify-content: flex-end;
        .Loginmenu{
            font-size:1.7rem;
            color:white;
            cursor: pointer;
            &:hover{
                text-decoration: none;
                color:rgba(255,255,255,.7);
            }
        }
    }
    .loginModal{
        position: fixed;
        right: 6rem;
        top:5.7rem;
        height:50rem;
        width: 40rem;
    }
}
.modalToggleBackground{
    z-index:5887;
    position:fixed;
    background:rgba(0,0,0,.6);
    height:100% !important;
    width:100%;
}

@media(max-width: 767px){
  .Loginmenu{
    font-size: 1rem;
  }
}
</style>
