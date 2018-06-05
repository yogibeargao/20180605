<template>
  <r-page>
      <top :title="_title" :showBack="true"/>
      <div id="container" class="map" v-show="showMap"></div>
                      <r-toast :model="this" value="showFlag" :text="toastText" :type='type'/>

       <r-tab-bar>
            <r-cell type="row" :vertical="true">
                        <r-cell >
                            <div class='location-name' v-show="showMap">{{locationName}}</div>
                        </r-cell>
                        <r-cell >
                            <r-box>
                                <r-button :onClick="click" :disabled="!showMap">{{_share}}</r-button>
                            </r-box>
                        </r-cell>
            </r-cell>
       </r-tab-bar>
  </r-page>
</template>

<script>
import Util from "../util/util";
import {LoadingApi} from 'rainbow-mobile-core';
export default {
  data() {
    return {
      locationName: null,
      latitude: null,
      longitude: null,
      showMap:false,
      showFlag:false,
      toastText:"",
      type:"success",
    };
  },
  computed:{
      _title(){
        const shareId = this.$route.query.shareId;
        return shareId?"位置响应":"签到详情"
      },
      _share(){
        const shareId = this.$route.query.shareId;
        return shareId?"响应":"签到"
      }
  },
  methods: {
    async click() {
      const share_id = this.$route.query.shareId;
      if(share_id){
        this.share();
      }else{
        this.sign();
      }
      
    },
    async share(){
      const param = {
        "id": this.$route.query.shareId,
        "sharedLongitude": this.longitude,
        "sharedLatitude": this.latitude,
        "sharedAddress": this.locationName
      };
      const status = await this.$http.post(`location/sharing/response`,param);
      if(status){
        this.toastText="响应成功";
        this.showFlag=true;
        // this.$router.back();

      }else{
        this.toastText="响应失败";
        this.type = "warn";
        this.showFlag=true;
      }
    },
    async sign(){
      const identityId = Util.getIdentityId(this);
      const param = {
        "studentNos": identityId,
        "longitude": this.longitude,
        "latitude": this.latitude,
        "signAddress": this.locationName
      };
      const status = await this.$http.post(`online/signin/create`,param);
      if(status){
        this.toastText="签到成功";
        this.showFlag=true;
        // this.$router.back();

      }else{
        this.toastText="签到失败";
        this.type = "warn";
        this.showFlag=true;
      }
    },

  },
  mounted() {
    const self = this;
    const map = new BMap.Map("container");
     LoadingApi.show(this,{
                transition: '',
                text: "正在定位"
      });

    map.disableDragging(); //禁止拖拽

    var myGeo = new BMap.Geocoder();

    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(
      function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          map.centerAndZoom(r.point, 16);
          var mk = new BMap.Marker(r.point);
          map.addOverlay(mk);
          map.panTo(r.point);
          myGeo.getLocation(r.point, function(result) {
            if (result) {
              self.longitude = r.longitude;
              self.latitude = r.latitude;
              self.locationName = result.address;
            }
          });
          self.showMap = true;
          LoadingApi.hide(self);
          //mk.enableDragging();

          mk.addEventListener("dragend", function(e) {
            // alert("当前位置：" + e.point.lng + ", " + e.point.lat);
            myGeo.getLocation(e.point, function(result) {
              if (result) {
                self.locationName = result.address;
              }
            });
          });
          mk.addEventListener("click", function() {
            var p = mk.getPosition(); //获取marker的位置
            // alert("marker的位置是" + p.lng + "," + p.lat);
            myGeo.getLocation(p, function(result) {
              if (result) {
                self.locationName = result.address;
              }
            });
          });
        } else {
          alert("failed" + this.getStatus());
        }
      },
      { enableHighAccuracy: true }
    );

    // var navigationControl = new BMap.NavigationControl({
    //   // 靠左上角位置
    //   anchor: BMAP_ANCHOR_TOP_LEFT,
    //   // LARGE类型
    //   type: BMAP_NAVIGATION_CONTROL_LARGE,
    //   // 启用显示定位
    //   enableGeolocation: true
    // });
    // map.addControl(navigationControl);
  }
};
</script>

<style>
#container {
  height: 812px;
}
.location-name {
  font-size: 16px;
  text-align: center;
}
</style>


