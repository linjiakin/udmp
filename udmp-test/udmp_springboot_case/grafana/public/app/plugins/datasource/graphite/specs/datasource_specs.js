/*! grafana - v4.1.2 - 2017-02-13
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["test/lib/common","test/specs/helpers","../datasource"],function(a,b){"use strict";var c,d,e;b&&b.id;return{setters:[function(a){c=a},function(a){d=a},function(a){e=a}],execute:function(){c.describe("graphiteDatasource",function(){var a=new d.default.ServiceTestContext,b={url:[""],name:"graphiteProd"};c.beforeEach(c.angularMocks.module("grafana.core")),c.beforeEach(c.angularMocks.module("grafana.services")),c.beforeEach(a.providePhase(["backendSrv"])),c.beforeEach(c.angularMocks.inject(function(b,c,d,e){a.$q=b,a.$httpBackend=d,a.$rootScope=c,a.$injector=e,d.when("GET",/\.html$/).respond("")})),c.beforeEach(function(){a.ds=a.$injector.instantiate(e.GraphiteDatasource,{instanceSettings:b})}),c.describe("When querying influxdb with one target using query editor target spec",function(){var b,d,e={panelId:3,rangeRaw:{from:"now-1h",to:"now"},targets:[{target:"prod1.count"},{target:"prod2.count"}],maxDataPoints:500};c.beforeEach(function(){a.backendSrv.datasourceRequest=function(b){return d=b,a.$q.when({data:[{target:"prod1.count",datapoints:[[10,1],[12,1]]}]})},a.ds.query(e).then(function(a){b=a}),a.$rootScope.$apply()}),c.it("should generate the correct query",function(){c.expect(d.url).to.be("/render")}),c.it("should set unique requestId",function(){c.expect(d.requestId).to.be("graphiteProd.panelId.3")}),c.it("should query correctly",function(){var a=d.data.split("&");c.expect(a).to.contain("target=prod1.count"),c.expect(a).to.contain("target=prod2.count"),c.expect(a).to.contain("from=-1h"),c.expect(a).to.contain("until=now")}),c.it("should exclude undefined params",function(){var a=d.data.split("&");c.expect(a).to.not.contain("cacheTimeout=undefined")}),c.it("should return series list",function(){c.expect(b.data.length).to.be(1),c.expect(b.data[0].target).to.be("prod1.count")}),c.it("should convert to millisecond resolution",function(){c.expect(b.data[0].datapoints[0][0]).to.be(10)})}),c.describe("building graphite params",function(){c.it("should return empty array if no targets",function(){var b=a.ds.buildGraphiteParams({targets:[{}]});c.expect(b.length).to.be(0)}),c.it("should uri escape targets",function(){var b=a.ds.buildGraphiteParams({targets:[{target:"prod1.{test,test2}"},{target:"prod2.count"}]});c.expect(b).to.contain("target=prod1.%7Btest%2Ctest2%7D")}),c.it("should replace target placeholder",function(){var b=a.ds.buildGraphiteParams({targets:[{target:"series1"},{target:"series2"},{target:"asPercent(#A,#B)"}]});c.expect(b[2]).to.be("target=asPercent(series1%2Cseries2)")}),c.it("should replace target placeholder for hidden series",function(){var b=a.ds.buildGraphiteParams({targets:[{target:"series1",hide:!0},{target:"sumSeries(#A)",hide:!0},{target:"asPercent(#A,#B)"}]});c.expect(b[0]).to.be("target="+encodeURIComponent("asPercent(series1,sumSeries(series1))"))}),c.it("should replace target placeholder when nesting query references",function(){var b=a.ds.buildGraphiteParams({targets:[{target:"series1"},{target:"sumSeries(#A)"},{target:"asPercent(#A,#B)"}]});c.expect(b[2]).to.be("target="+encodeURIComponent("asPercent(series1,sumSeries(series1))"))}),c.it("should fix wrong minute interval parameters",function(){var b=a.ds.buildGraphiteParams({targets:[{target:"summarize(prod.25m.count, '25m', 'sum')"}]});c.expect(b[0]).to.be("target="+encodeURIComponent("summarize(prod.25m.count, '25min', 'sum')"))}),c.it("should fix wrong month interval parameters",function(){var b=a.ds.buildGraphiteParams({targets:[{target:"summarize(prod.5M.count, '5M', 'sum')"}]});c.expect(b[0]).to.be("target="+encodeURIComponent("summarize(prod.5M.count, '5mon', 'sum')"))}),c.it("should ignore empty targets",function(){var b=a.ds.buildGraphiteParams({targets:[{target:"series1"},{target:""}]});c.expect(b.length).to.be(2)})})})}}});