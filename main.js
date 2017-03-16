Vue.component('firstcommit', {
    props: ['date'],
    template: '<div>First commit: {{ date }}</div>'
});

var prompt = new Vue({
    el: '#app',
    data: {
        message: 'Enter username',
        show_commit: false,
        date: null
    },
    methods: {
        fetch_first_commit: fetch_first_commit
    },
});


function fetch_first_commit (username, repo) {
    let repo_base_url = 'https://api.github.com/repos/';
    let call_url = repo_base_url + username + '/' + repo + '/commits';
    fetch(call_url)
        .then((response)=>response.json())
        .then((data)=>{
            let commit = get_earliest_commit(data);
            this.date = commit.commit.committer.date;
            this.show_commit = true;
        });
}

function get_earliest_commit(commits) {
    // For now, assume the last commit is the first one 
    return commits[commits.length-1];
}
