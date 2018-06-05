<template>
  <r-page>
      <top :title="this.isMessage?'消息':'公告'" :showBack="true"/>
      <r-body>
      <r-row title="筛选" :isLink="true" :model="this" value="filterValue" :onClick="onClickFilter"/>
      <r-panel :data="article_list" type='4'/>
      <r-popup position="right" :model="this" value="showFilter" :disableMask="true">
        <r-checker title="信息来源"  :data="objectList" :modelKey="true" :model="this" value="filter" :max="1" v-if="!isMessage"/>
        <r-checker title="已读/未读"  :data="filterList" :modelKey="true" :model="this" value="readFilter" :max="1" />
        <r-box position="center" >
        <r-button :mini="true" :onClick="_filter">筛选</r-button>
        </r-box>
      </r-popup>
      </r-body>
  </r-page>
</template>

<script>
import index from "../assets/top.gif";
import Util from "../util/util";
export default {
  data() {
    return {
       filter:null,
       readFilter:null,
       showFilter:false,
       filterValue:null,
       objectList: [{key: '0', value: '学校'}, {key: '1', value: '教务'}, {key: '2', value: '系部'}],
       filterList: [{key: '0', value: '未读'}, {key: '1', value: '已读'}],
       article_list: []
    };
  },
  computed:{
    isMessage(){
      if(this.$route.query&&this.$route.query.type){
        return true;
      }else{
        return false;
      }
    }
  },
  methods :{
    onClickFilter(){
        this.showFilter= true;
    },
    getSourceNameById(id){
       const source =  _.find(this.objectList,(source)=>{
          return source.key==id;
       });
       if(source){
         return source.value;
       }else{
         return '辅导员';
       }
    },
    _filter(){
        let source = null;
        if(this.isMessage){
            source = this.filterList
        }else{
            source = this.objectList;
        }
        _.each(source,(obj)=>{
            _.each(this.filter,(f)=>{
                if(obj.key==f){
                  this.filterValue = obj.value;
                }
            })
        })
        this.loadMessage();
    },
    async loadMessage(){
            const identityId = Util.getIdentityId(this);
            let param = {"identityId":identityId,"pageNo":1,"pageSize":50};

             if(this.isMessage){
                if(this.readFilter){
                    param["status"]=this.readFilter[0];
                }
              }else{

                if(this.filter){
                    param["source"]=this.filter[0];
                }

                if(this.readFilter){
                    param["status"]=this.readFilter[0];
                }
              }

         
            let url = "article/list";
            if(this.isMessage){
                url = "message/list"
            }
            const articles = await this.$http.post(url,param);
            
            const List = [];
            _.each(articles.body,(article)=>{
              const _article = {};
              _article["id"] = this.isMessage?article.id:article.readId;
              _article["title"] = article.title;
              _article["desc"] = article.content;
              _article["url"] = '/notes/detail?type='+this.isMessage+'&id='+_article.id+'&title='+article.title+'&content='+ article.content;
              _article["meta"] = {"source":"来源： "+ article.author,"date":"更新时间： "+article.createTime};
              List.push(_article)
            });
            this.article_list = List;
            if(this.showFilter){
              this.showFilter = false;
            }
    }
  },
   mounted(){
           this.loadMessage();
  }
};
</script>


