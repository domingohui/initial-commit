'use strict';

Vue.component('firstcommit', {
    props: ['commit'],
    template: `
    <div>
    <h4><a :href="commit.html_url">{{ commit.commit.message }}</a></h4>
    <h4>{{ commit.commit.committer.date }}</h4>
    <h5>By {{ commit.author.login }}</h5>
    <p>{{ commit.sha }}</p>
    </div>`
});

Vue.component('errormsg', {
    props: ['message'],
    template: `
    <div class="error">
    <p>{{ message||'Something went wrong...' }}</p>
    </div>`
});

var prompt = new Vue({
    el: '#app',
    data: {
        /* Model fields linked to input */
        username: '',
        repo: '',
        /********************************/
        show_commit: false,
        commit: null, // No commit message shown when null
        error: null // No error message shown when null
    },
    methods: {
        fetch_first_commit: fetch_first_commit
    },
});

function fetch_first_commit () {
    // Trim whitespace in input
    let username = this.username.trim();
    let repo = this.repo.trim();

    // Make API calls
    if (username && repo) {
        let repo_base_url = 'https://api.github.com/repos/';
        let call_url = repo_base_url + username + '/' + repo + '/commits';
        fetch(call_url)
            .then((response)=> {
                if (response.ok) {
                    return response.json();
                }
                throw response;
            })
            .then((data)=>{
                this.commit = get_earliest_commit(data);
                this.show_commit = true;
                this.error = null;
            })
            .catch((error_response) => {
                let error_msg = '';
                if (error_response.status && error_response.status === 404) {
                    // Invalid username or repo name
                    error_msg = 'Hmmm I can\'t seem to find repo. Please check username and repo name.';
                }
                else if (error_response.status && error_response.status === 403) {
                    error_msg = 'API limit exceeded... https://developer.github.com/v3/#rate-limiting';
                }
                else {
                    // Other errors :\
                    error_msg = 'Oops.. Something\'s not right. ';
                    error_msg += 'Please feel free to open a PR @ https://github.com/domingohui/initial-commit';
                }
                this.error = error_msg;
            });
    }
    else if (!username) {
        this.error = 'Please enter a username...';
    }
    else if (!repo) {
        this.error = 'And a repo name would be nice!';
    }
}

function get_earliest_commit(commits) {
    // For now, assume the last commit is the first one 
    return commits[commits.length-1];
}
