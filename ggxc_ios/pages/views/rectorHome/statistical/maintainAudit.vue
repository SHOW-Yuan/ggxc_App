<template>
	<view class="box">
		<!-- 日期区域 -->
		<view class="header-date">
			<view>
				<text @click="shangyue">上一月</text>
				<text>{{ynow}}-{{mnow}}</text>
				<text :class="{isBgc:isBgc}" @click="xiayue">下一月</text>
			</view>
		</view>
		
		<view class="list-box">
			<block v-for="(item,index) in listDatas" :key="index" v-if="item.auditState == 0">
				<view class="item-box">
					<view class="item-box-one">
						<view>
							<text>{{item.cphm}}</text>
							<text>车牌号</text>
						</view>
						<view>
							<text>{{item.Money}}￥</text>
							<text>维修费</text>
						</view>
						<view>
							<text>{{item.part}}</text>
							<text>维修部件</text>
						</view>
					</view>
					<view class="item-box-two">
						<text>{{item.bxdate}}</text>
						<text @click="auditClick(item)">未审核</text>
					</view>
				</view>
			</block>
		</view>
		
		
		<neil-modal
		    :show="show" 
		    @close="show = false" 
		    title="维修审核" 
			confirm-text="通过审核"
			cancel-text="拒绝审核"
		    :content=text
		    @cancel="bindBtn(1)" 
		    @confirm="bindBtn(0)">
		</neil-modal>
		
	</view>
</template>

<script>
	import neilModal  from '@/components/neil-modal/neil-modal.vue';
	export default {
		components: {neilModal},
		data(){
			return {
				datas: [],
				//日期
				newDate: '', //当前的日期的信息
				ynow: '', //当前的年数
				mnow: '', //当前的月份
				date1: '', //当前的 2019-6
				isBgc:true,
				formData: { // 请求数据
				  datas: [{
				    date: "",
				    uid: "",
				    schoolcode: "",
				  }]
				},
				listDatas:[],
				// 选中的项
				item:[],
				show:false,
				text:"",
				// 审核
				formData2: {
				  datas: [
				    {
				      uid: "",
				      dataid: "",
				      result: ""
				    }
				  ]
				}
			}
		},
		created() {
		  //日历
		  this.newDate = new Date();
		  this.ynow = this.newDate.getFullYear();
		  let mon = this.newDate.getMonth(); //月份
		  this.mnow = ++mon; //先自增  后赋值
		  if (this.mnow < 10) {
		    this.mnow = '0' + `${this.mnow}`;
		  }
		  this.date1 = `${this.ynow}-${this.mnow}`;
		  /*接口406*/
		  this.datas = JSON.parse(uni.getStorageSync('datas'));
		  this.formData.datas[0].date = this.date1;
		  this.formData.datas[0].uid = this.datas[0].uid;
		  this.formData2.datas[0].uid = this.datas[0].uid;
		  this.formData.datas[0].schoolcode = this.datas[0].userapps[0].schoolcode;
		  this.loadData();
		},
		methods: {
			loadData(){
				uni.request({
					url:this.$ip.url.ip1 + "/app/menmian-area/4QAAAAEBAB4/VehicleRepair",
					method:'post',
					data:JSON.stringify(this.formData),
					success: (res) => {
						let { data: { code, datas, msg } } = res;
						if(code!==200){
							uni.showToast({
								title: msg,
								icon:'none'
							})
							this.listDatas = []
							 return;
						}
						this.listDatas = datas;
						console.log(this.listDatas);
					}
				})
			},
			//上一月  下一月
			shangyue() {
			  let date2 = `${this.ynow}-${this.mnow}`; //会变化的日期
			  if (this.mnow > 1) {
			    if (this.mnow <= 10) {
			      this.mnow--;
			      this.mnow = "0" + `${this.mnow}`;
			      date2 = `${this.ynow}-${this.mnow}`;
			    } else if (this.mnow > 10) {
			      this.mnow--;
			      date2 = `${this.ynow}-${this.mnow}`;
			    }
			  } else if (this.mnow <= 1) {
			    if (this.mnow < 10) {
			      this.ynow--;
			      this.mnow = "0" + `${this.mnow}`;
			      this.mnow = 12;
			      date2 = `${this.ynow}-${this.mnow}`;
			    }
			  }
			  this.isBgc = false
			  this.formData.datas[0].date = date2;
			  this.loadData();
			},
			xiayue() {
			  let date2 = `${this.ynow}-${this.mnow}`; //会变化的日期
			  if (date2 !== this.date1) {
			    if (this.mnow < 12) {
			      if (this.mnow < 9) {
			        this.mnow++;
			        this.mnow = "0" + `${this.mnow}`;
			        date2 = `${this.ynow}-${this.mnow}`;
			      } else {
			        this.mnow++;
			        date2 = `${this.ynow}-${this.mnow}`;
			      }
			    } else if (this.mnow >= 12) {
			      this.ynow++;
			      this.mnow = 1;
			      this.mnow = "0" + `${this.mnow}`;
			      date2 = `${this.ynow}-${this.mnow}`;
			    }
			    if (date2 == this.date1) {
			      this.isBgc = true
			    }
			    this.formData.datas[0].date = date2;
			    this.loadData();
			  } else if (date2 == this.date1) {
			    this.isBgc = true
			  }
			  this.formData.datas[0].date = date2;
			  this.loadData();
			},
			auditClick(item){
				this.text = item.coach + ' 给车辆 ' + item.cphm + " 维修,消费: " + item.Money + '元'
				this.item = item
				this.show = true
				this.formData2.datas[0].dataid = item.dataid;
			},
			bindBtn(val){
				this.formData2.datas[0].result = val;
				console.log(val);
				uni.request({
					url:this.$ip.url.ip1 + "/app/menmian-area/4QAAAAEBAB4/VehicleRepairAudit",
					method:'post',
					data:JSON.stringify(this.formData2),
					success: (res) => {
						let { data: { code, datas, msg } } = res;
						if(code==200){
							uni.showToast({
								title: '审核成功',
								icon:'none'
							})
							this.loadData();
						}else {
							uni.showToast({
								title: msg,
								icon:'none'
							})
							this.loadData();
						}
					}
				})
				this.show = false
			}
		}
	}
</script>

<style>
	/* 头部 */
	.header-date {
		font-size: 24upx;
	}
	.header-date>view {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #ECECEC;
		padding: 20upx;
		color: #000000;
	}
	.header-date>view text:nth-child(odd) {
		background-color: rgb(4, 190, 158);
		padding: 8upx 24upx;
		color: #FFFFFF;
	}
	.header-date>view text:nth-child(even) {
		font-weight: 700;
	}
	.list-box {
		border-radius: 20upx;
		padding: 20upx
	}
	.item-box {
		border: 2upx solid #ccc;
		border-radius: 20upx;
		margin-bottom: 20upx;
		overflow: hidden;
		background-color: #FFFFFF;
	}
	.item-box .item-box-one {
		padding: 0 30upx;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-size: 24upx;
		color: #828282;
	}
	.item-box .item-box-one view {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40upx 0;
	}
	.item-box-one view text:nth-child(1) {
		color: #f87144;
		font-size: 30upx;
		font-weight: 700;
		margin-bottom: 4upx;
	}
	.item-box-one view:nth-child(1) text:nth-child(1){
		color: #00BB99;
	}
	.item-box-two {
		background-color: #eeeeee;
		padding: 10upx 30upx;
		display: flex;
		justify-content: space-between;
		font-size: 24upx;
		font-weight: 700;
		align-items: center;
	}
	.item-box-two text:nth-child(2) {
		background-color: #00BB99;
		color: #FFFFFF;
		font-size: 30upx;
		padding: 6upx 12upx;
		border-radius: 10upx;
	}
	.isBgc {
		background-color: #bdbdbd!important;
	}
</style>
