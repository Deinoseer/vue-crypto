<template lang="html">
    <div id="cryptoList" class="crypto-list" v-loading="loading" v-on:scroll="handleScroll">
        <el-main>
            <el-row type="flex" v-if="errors.length" class="error-row">
                <el-col :span="24">
                    <div class="errors-list" v-model="errors" v-for="error in errors">{{ error }}</div>
                </el-col>
            </el-row>
            <el-row class="currencies-row" type="flex" v-for="(currency, i) in sortByPrice" v-bind:key="i">
                <div class="currency">
                    <div class="currency__count">{{ i + 1 }}</div>
                    <div class="currency__img">
                        <img v-bind:src="getImageUrl(currency.CoinInfo.ImageUrl)">
                    </div>
                    <div class="currency__short-name">
                        {{ currency.CoinInfo.Name }}
                    </div>
                    <div class="currency__full-name">
                        {{ currency.CoinInfo.FullName }}
                    </div>
                    <div class="currency__price" v-bind:class="setColor(currency.RAW.USD.CHANGEHOUR)">
                        {{ currency.DISPLAY.USD.PRICE }}
                        <span class="currency__price-change" v-if="currency.RAW.USD.CHANGEHOUR !== 0">
                            {{ currency.DISPLAY.USD.CHANGEHOUR }}
                        </span>
                    </div>
                </div>
            </el-row>
        </el-main>
    </div>
</template>

<script>
    import axios from 'axios';
    import __ from 'lodash';

    let IMAGES_URL = 'https://www.cryptocompare.com';
    let API_URL = 'https://min-api.cryptocompare.com/';
    let API_KEY = 'a358f000f8a0bdaec96fda55ffde132b422ce7f3066db669379239f6af4f2982';
    let UPDATE_INTERVAL = 30000;

    export default {
        data: function () {
            return {
                errors: [],
                currencies: [],
                page: 0,
                itemsByPage: '100',
                loading: false
            }
        },
        created() {
            this.getCurrencies();
            setInterval(() => {
               this.getCurrencies();
            }, UPDATE_INTERVAL);
        },
        mounted() {

        },
        computed: {
            sortByPrice() {
                let filteredArr = __.filter(this.currencies, function (el) {
                    if (typeof el.RAW !== 'undefined') {
                        return el;
                    }
                });
                return __.sortBy(filteredArr, function (el) {
                    return el['RAW']['USD']['PRICE'];
                }).reverse();
            }
        },
        methods: {
            getCurrencies() {
                let self = this;
                for(let i = 0; this.page >= i; i++) {
                    let url = new URL(API_URL + "data/top/mktcapfull");
                    let queryString = url.search;
                    let queryParams = new URLSearchParams(queryString);
                    this.loading = true;
                    queryParams.append('api_key', API_KEY);
                    queryParams.append('limit', self.itemsByPage);
                    queryParams.append('tsym', 'USD');
                    queryParams.append('page', i);
                    url.search = queryParams;
                    axios.get(url.toString()).then(response => {
                        if(response.data.Response === 'Error') { //catch error by response value
                            this.errors.push(response.data.Message);
                        }
                        this.currencies = __.unionBy(response.data.Data, this.currencies, 'CoinInfo.Id');
                    }).catch((error) => {
                        this.errors.push(error);
                    }).finally(() => {
                        this.loading = false;
                    });
                }
            },
            setColor(changedVal) {
                if (changedVal === 0) { return; }
                return changedVal > 0 ? "currency__price_green" : "currency__price_red";
            },
            getImageUrl(imagePath) {
                return IMAGES_URL + imagePath;
            },
            handleScroll(e) {
                let container = e.srcElement;
                if(container.offsetHeight + container.scrollTop === container.scrollHeight) { //bottom
                    this.page += 1;
                    this.getCurrencies();
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-main {
        padding: 0;
    }

    ::-webkit-scrollbar {
        width: 8px;
        background-color: #38426c;
    }

    ::-webkit-scrollbar-track {
        background-color: #38426c;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 6px;
        background-color: #fff;
    }

    .crypto-list {
        display: block;
        width: 680px;
        max-height: calc(100vh - 15px);
        overflow-y: auto;
        margin: 0 auto;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
        box-shadow: 3px 3px 10px 0 #778EDB;
        color: #fff;
    }

    .currencies-row {
        align-items: center;
        border-bottom: 1px solid #38426c;
    }

    .currency {
        display: flex;
        align-items: center;
        font-family: monospace;
        width: 100%;
        height: 100%;
        padding: 14px 18px;
        background: #1c1c49;
        transition: opacity .3s;
        cursor: default;

        &:hover {
            opacity: .98;
        }

        &__count {
            font-size: 18px;
            font-weight: bold;
            color: #fff;
            min-width: 30px;
            text-align: center;
        }

        &__short-name {
            font-size: 16px;
            color: #ccc;
        }

        &__full-name {
            font-size: 20px;
        }

        &__short-name,
        &__full-name {
            margin-right: 22px;
        }

        &__price {
            font-size: 20px;
            font-weight: bold;
            margin-left: auto;
            padding-right: 8px;

            &_red {
                color: #fe5c5c;
            }

            &_green {
                color: #47d166;
            }

            &-change {
                position: relative;
                top: -10px;
                font-size: 12px;
            }
        }

        &__img {
            flex-shrink: 0;
            margin-left: 22px;
            margin-right: 22px;

            img {
                max-height: 100%;
                width: 60px;
            }
        }
    }
</style>