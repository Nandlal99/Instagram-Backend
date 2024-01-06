This is a social media app like (Instagram)
App required two models
1.Post
2.User

Post model look like --
    1.Post image
    2.Post content
    3.Post createdBy
        --- give userId
    4.Post timestamp
    5.Post Likes
    6.Post Comments

User model look like --
    1.User name
    2.User email
    3.User password
    4.User createdPosts
        --- give postId
    5.User profilePic
    6.User description
    7.User Follower
    8.User Following


App required routes ---

1.FeedPost routes ---
    1.Create Post
    2.Get All Post
    3.Get One Post
    4.Delete Post
    5.Update Post(Optional)

2.Auth routes ---
    1.Signup
        --- Normal user create like user Name,Email & Password 
    2.Login
        --- Login app required email & password
    3. Logout User

3.User routes ---
    1.Update User 
        --- means update User data like profilePic,description etc.
    2.Get User details

    Nandlal Jaiswal

