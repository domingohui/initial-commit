'use strict';

Vue.component('firstcommit', {
    props: {
        commit: Object
    },
    template: `
    <div>
    <h4><a :href="commit.html_url">{{ commit.commit.message }}</a></h4>
    <h4>{{ commit.commit.committer.date }}</h4>
    <h5>By {{ commit.author.login }}</h5>
    <p>{{ commit.sha }}</p>
    </div>`
});

Vue.component('errormsg', {
    props: {
        message: {
            type: String,
            default: null
        }
    },
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
        fetch_first_commit: fetch_first_commit_wrapper,
        reset: reset
    },
});

function fetch_first_commit_wrapper () {
    // Pass commit object back to this -> which is linked to the firstcommit component
    fetch_first_commit (this.username, this.repo, 
        (commit) => {
            // Need a callback for async fetch in the helper
            this.commit = commit;
            this.show_commit = true;
            // Clear error message
            this.error = null;
        },
        (error_msg) => {
            // Clear previous commit displayed
            this.commit = null;
            this.show_commit = false;

            // Display error msg
            this.error = error_msg;
        }
    );
}

function reset () {
    this.commit = null;
    this.show_commit = false;
    this.username = '';
    this.repo = '';
    this.error = null;
}
