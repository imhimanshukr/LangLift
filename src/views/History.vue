<template>
	<v-container class="mt-3" v-if="userHistory.length > 0">
		<div class="d-flex justify-space-between align-center mb-3">
			<h3 class="white--text">Your History</h3>
			<v-btn class="text-capitalize white--text" color="#616161" @click="clearSelectedHistory()"
				v-if="selectedIds.length > 0 && deleteOption === 4">Delete</v-btn>
			<v-btn class="text-capitalize white--text" color="#616161" @click="clearAllHistory()" v-else>Clear all</v-btn>
		</div>
		<p class="mb-0 pb-1 show-on-mobile"><i style="color: #a3a3a3;">Click on translation to search</i></p>
		<div class="history">
			<v-sheet color="#1B1B1F" class="rounded-lg mb-4" v-for="(history, index) in userHistory" :key="index">
				<div class="d-flex justify-space-between align-center pa-4">
					<p class="white--text mb-0">{{ getDateTime(history.historyDateTime) }}</p>
					<v-icon class="pointer" color="#c3c3c3" @click="deleteHistoryByDay(index)" :class="{'disable' : deleteOption === 4 && selectedIds.length > 0}">mdi-delete</v-icon>
				</div>
				<v-data-table :headers="headers" :items="history.historyData" dark fixed-header
					:items-per-page="history.historyData.length" hide-default-footer height="300px">
					<template v-slot:item="{ item }">
						<tr>
							<td class="select-column"><v-checkbox v-model="item.selected"
									@change="selectHistory($event, item.id)"></v-checkbox></td>
							<td class="time-column">{{ item.time }}</td>
							<td class="translation-column text-capitalize"><span class="pointer translation" @click="getTranslation(item.translation)">{{ item.translation.sourceText + " - " +item.translation.targetText }}</span></td>
							<td class="action-column">
								<v-menu>
									<template v-slot:activator="{ on }">
										<v-icon class="mr-2" color="#fff" v-on="on">mdi-dots-vertical</v-icon>
									</template>
									<v-list dark>
										<v-list-item v-for="menu in tableMenu" class="pointer" :key="menu.text"
											style="min-height: 38px;" @click="deleteSingleHistory(item.id)">
											<v-icon class="mr-2">{{ menu.icon }}</v-icon>
											<span>{{ menu.text }}</span>
										</v-list-item>
									</v-list>
								</v-menu>
							</td>
						</tr>
					</template>
				</v-data-table>
			</v-sheet>
		</div>
		<v-dialog v-model="showDeleteDialog" dark max-width="290">
			<v-card color="#323232" elevation="24">
				<v-card-title class="text-h6">
					Are you sure you want to delete?
				</v-card-title>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="cancelDelete()">
						Cancel
					</v-btn>
					<v-btn color="red darken-1" text @click="onFinalDelete()">
						Delete
					</v-btn>
					<audio ref="audioElement" src="../assets/delete.mp3"></audio>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
	<v-container v-else class="no-data">
		<h1 class="text-h6 mb-2">Text you searched for appears here</h1>
		<v-btn to="/" link dark>Home</v-btn>
	</v-container>
</template>  
  
<script>
import moment from "moment";
export default {
	name: "HistoryPage",
	data: () => ({
		headers: [
			{ text: "Select", value: "selected", sortable: false },
			{ text: "Time", value: "time" },
			{ text: "Text - Translation", value: "translation", sortable: false },
			{ text: "Action", value: "", sortable: false },
		],
		userData: null,
		tableMenu: [
			{
				text: 'Remove',
				icon: "mdi-delete"
			}
		],
		selectToDelete: false,
		selectedIds: [],
		showDeleteDialog: false,
		deleteOption: null,
		idToDelete: null,
	}),
	mounted() {
		const userData = JSON.parse(localStorage.getItem(`${this.$store.state.userName.replace(/\s+/g, '')}-LangLiftLoggedIn`));
		this.$store.state.history = userData.history;
	},
	methods: {
		getDateTime(dateTime) {
			let today = moment().format("dddd, MMMM DD, YYYY");
			if (dateTime == today) {
				return `Today - ${dateTime}`
			} else {
				return dateTime
			}
		},
		clearAllHistory() {
			this.showDeleteDialog = true;
			this.deleteOption = 1;
		},
		deleteHistoryByDay(index) {
			this.showDeleteDialog = true;
			this.deleteOption = 2;
			this.idToDelete = index;
			console.log("deleteHistoryByDay: ", index);
		},
		deleteSingleHistory(id) {
			this.showDeleteDialog = true;
			this.deleteOption = 3;
			this.idToDelete = id;
			console.log("deleteSingleHistory: ", id);
		},
		selectHistory(isChecked, id) {
			if (isChecked) {
				this.selectedIds.push(id)
			} else {
				let index = this.selectedIds.indexOf(id);
				if (index !== -1) {
					this.selectedIds.splice(index, 1);
				}
			}
			if(this.selectedIds.length > 0){
				this.deleteOption = 4;
			} else {
				this.deleteOption = null;
			}
			console.log("this.selectedIds: ", this.selectedIds);
		},
		clearSelectedHistory() {
			this.showDeleteDialog = true;
		},
		onFinalDelete() {
			this.userData = JSON.parse(localStorage.getItem(`${this.$store.state.userName.replace(/\s+/g, '')}-LangLiftLoggedIn`));
			if (this.deleteOption === 1) {
				this.userData.history = [];
			}
			if (this.deleteOption === 2 && this.idToDelete > -1) {
				console.log("this.idToDelete: ", this.idToDelete);
				this.userData.history.splice(this.idToDelete, 1);
			}
			if (this.deleteOption === 3 && this.idToDelete) {
				this.userData.history.forEach((item, index) => {
				item.historyData = item.historyData.filter(data => data.id !== this.idToDelete);
				if (item.historyData.length === 0) {
				this.userData.history.splice(index, 1);
				}
				});
			}
			if (this.deleteOption === 4 && this.selectedIds.length > 0) {
			this.userData.history.forEach((item, index) => {
				item.historyData = item.historyData.filter(data => !this.selectedIds.includes(data.id));
				if (item.historyData.length === 0) {
				this.userData.history.splice(index, 1);
				}
			});
			}
			this.showDeleteDialog = false;
			this.idToDelete = null;
			this.deleteOption = null;
			localStorage.setItem(`${this.$store.state.userName.replace(/\s+/g, '')}-LangLiftLoggedIn`, JSON.stringify(this.userData));
			this.$store.state.history = this.userData.history;
			this.$refs.audioElement.play();
			this.$toast.success("Deleted Successfully!", {timeout: 2000});
		},
		cancelDelete(){
			this.showDeleteDialog = false;
			this.idToDelete = null;
			this.deleteOption = null;
			this.selectedIds = [];
		},
		getTranslation(translation){
			console.log("translation: ", translation);
			this.$router.push({
				name: "HomePage",
				params:{
					translation
				}
			})
		}
	},
	computed: {
		userHistory() {
			return this.$store.state.history
		}
	}
};
</script>
  
<style scoped>
::v-deep .v-data-table__wrapper,
::v-deep .theme--dark.v-data-table.v-data-table--fixed-header thead th {
	background-color: #1B1B1F !important;
}

::v-deep .v-data-table__wrapper::-webkit-scrollbar {
	width: 8px;
	height: 8px;
}

::v-deep .v-data-table__wrapper::-webkit-scrollbar-track {
	background: #2D2D2D;
	border-radius: 4px;
}

::v-deep .v-data-table__wrapper::-webkit-scrollbar-thumb {
	background-color: #4E4E4E;
	border-radius: 4px;
}

::v-deep .v-data-table__wrapper::-webkit-scrollbar-thumb:hover {
	background-color: #7F7F7F;
}

.select-column {
	min-width: 50px;
}

.time-column {
	min-width: 90px;
	text-align: left;
}

.translation-column {
	width: 70%;
	text-align: left;
}

.action-column {
	width: 50px;
	text-align: right;
}

.history {
	max-height: calc(100vh - 170px);
	overflow-x: hidden;
	overflow-y: auto;
}

.history::-webkit-scrollbar {
	width: 0;
}
.disable {
	pointer-events: none;
	cursor: not-allowed !important;
	color: #999999 !important;
}
.no-data {
	height: calc(100vh - 90px);
    display: flex;
    align-items: center;
    justify-content: center;
	flex-direction: column;
}
.no-data h1{
	color: #9b9b9b;
	font-weight: 400;
	text-align: center;
}
.translation:hover{
	text-decoration: underline;
}

::v-deep .theme--dark.v-data-table > .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background: transparent;
}
</style>
  