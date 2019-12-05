<template>
	<view class="box">
		<view class="list-box">
			<block v-for="(item,index) in listDatas" :key="index">
				<view class="item-box">
					<view class="item-box-one">
						<view>
							<text>{{item.name}}</text>
							<text>学员姓名</text>
						</view>
						<view>
							<text>{{item.kskm}}</text>
							<text>科目</text>
						</view>
						<view>
							<text>{{item.phone}}</text>
							<text>手机号</text>
						</view>
					</view>
					<view class="item-box-two">
						<text>{{item.date}}</text>
						<text @click="auditClick(item)">未审核</text>
					</view>
				</view>
			</block>
		</view>
		
		<neil-modal
		    :show="show" 
		    @close="show = false" 
		    title="燃料审核" 
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
		components: { neilModal },
		data(){
			return {
				datas: [],
				formData: {
				  datas: [
				    {
				      uid: '',
				      schoolcode: '',
				      id: ''
				    }
				  ]
				},
				// 页面数据
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
		created(){
			this.datas = JSON.parse(uni.getStorageSync('datas'));
			this.formData.datas[0].uid = this.datas[0].uid;
			this.formData.datas[0].id = this.datas[0].id;
			this.formData2.datas[0].uid = this.datas[0].uid;
			this.formData.datas[0].schoolcode = this.datas[0].userapps[0].schoolcode;
			this.loadData();
		},
		methods:{
			// 页面请求数据
			loadData(){
				uni.request({
					url:this.$ip.url.ip1 + "/app/menmian-area/4QAAAAEBAB4/about",
					method:'post',
					data:JSON.stringify(this.formData),
					success: (res) => {
						let { data: { code, datas, msg } } = res;
						if(code!==200){
							uni.showToast({
								title: msg,
								icon:'none'
							})
							 return;
						}
						this.listDatas = datas;
						this.listDatas.map(x=>{
							if(x.kskm == 1){
								x.kskm = '科目一'
							}else if(x.kskm == 2){
								x.kskm = '科目二'
							}else if(x.kskm == 3){
								x.kskm = '科目三'
							}else if(x.kskm == 4){
								x.kskm = '科目四'
							}
						})
						console.log(this.listDatas);
					}
				})
			},
			auditClick(item){
				this.text = item.name + "要约考,是否通过审核"
				this.item = item
				this.show = true
				this.formData2.datas[0].dataid = item.dataid;
			},
			bindBtn(val){
				this.formData2.datas[0].result = val;
				console.log(val);
				uni.request({
					url:this.$ip.url.ip1 + "/app/menmian-area/4QAAAAEBAB4/about_audit",
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
	page {
		background-color: #F8F8F8;
	}
	.box {
		padding: 30upx;
	}
	.list-box {
		border-radius: 20upx;
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
		font-size: 24upx;
		color: #828282;
	}
	.item-box .item-box-one view {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 50upx 0;
	}
	.item-box-one view text:nth-child(1) {
		color: #f87144;
		font-size: 32upx;
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
		font-size: 32upx;
		padding: 6upx 12upx;
		border-radius: 10upx;
	}
</style>
