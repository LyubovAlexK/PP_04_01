function filter(whiteList, blackList){
    let result = [];
    for (let i=0; i<whiteList.length; i++)
    {
        if (!blackList.includes(whiteList[i])) result.push(whiteList[i]);
    }
    return result;
}

let whiteList = ['my-email@gmail.ru', 'jsfunc@mail.ru', 'annavkmail@vk.ru', 'fullname@skill.ru', 'goodday@day.ru'];

let blackList = ['jsfunc@mail.ru','goodday@day.ru'];

console.log(filter(whiteList, blackList));