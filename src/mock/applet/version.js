import Mock from "mockjs";

let arr = [];
for (let i = 0; i < 20; i++) {
  arr.push({
    appletName: `智慧冰球${i}`,
    account: "中国冰球协会",
    adminAccount: `admin${i}`,
    currentVersion: "1.5",
    newestVersion: "1.6",
    auditResult: 1,
    failReason: "未提供相应证明",
    id: i
  });
}

Mock.mock(
  `${process.env.VUE_APP_API_BASE_URL}/getVersionTableData`,
  "get",
  () => {
    let result = {};
    result.code = 0;
    result.data = arr;
    result.total = arr.length;
    return result;
  }
);
