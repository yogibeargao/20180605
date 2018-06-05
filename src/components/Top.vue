<template>
<div>
        <r-header :title="title" :showBack="showBack" backText="后退" :showMore="true" :onClickMore="onClickMore"></r-header>
        <r-actionsheet :model="this" value="showMenu" :menuList="menuList" :headerHtml="headerHtml" :onClick="onClickSheet"/>
</div>
</template>

<script>
export default {
  props: {
    title: String,
    showBack:Boolean
  },
  data() {
    return {
      showMenu:false,
      menuList:{
          zh: '退出',
      }
    };
  },
  methods:{
    onClickMore(){
        if(this.showMenu){
          this.showMenu = false;
        }else{
          this.showMenu = true;
        }
    },
    onClickSheet(key){
      window.location.hash="/"
    }
  },
  computed: {
    headerHtml(){
        return `<h6>操作</h6>`
    },
  }
};
</script>