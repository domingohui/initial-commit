'use strict';

function fetch_first_commit (u, r, callback, error) {
    // Trim whitespace in input
    let username = u.trim();
    let repo = r.trim();

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
                callback(get_earliest_commit(data));
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
                    // Other errors
                    error_msg = 'Oops.. Something\'s not right. ';
                    error_msg += 'Please feel free to open a PR @ https://github.com/domingohui/initial-commit';
                }
                // Set error message
                error(error_msg);
            });
    }
    else if (!username) {
        error('Please enter a username...');
    }
    else if (!repo) {
        error('And a repo name would be nice!');
    }
}

function get_earliest_commit(commits) {
    // For now, assume the last commit is the first one 
    return commits[commits.length-1];
}
