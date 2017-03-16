Vue.component('firstcommit', {
    props: ['commit'],
    template: '<div>First commit: {{ commit }}</div>'
});

var prompt = new Vue({
    el: '#app',
    data: {
        /* Model fields linked to input */
        username: '',
        repo: '',
        /********************************/
        show_commit: false,
        commit: null
    },
    methods: {
        fetch_first_commit: fetch_first_commit
    },
});


function fetch_first_commit () {
    let username = this.username.trim();
    let repo = this.repo.trim();
    if (username && repo) {
        let repo_base_url = 'https://api.github.com/repos/';
        let call_url = repo_base_url + username + '/' + repo + '/commits';
        fetch(call_url)
            .then((response)=>response.json())
            .then((data)=>{
                this.commit = Object.assign({}, get_earliest_commit(data));
                this.show_commit = true;
            });
    }
}

function get_earliest_commit(commits) {
    // For now, assume the last commit is the first one 
    return commits[commits.length-1];
}
