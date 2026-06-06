// Frontend Application Logic for Art Gallery Project

$(document).ready(function() {
    // 1. Navbar Active Tab Highlighter
    const currentPath = window.location.pathname;
    $('.top_menu li').removeClass('active');
    if (currentPath.includes('index.html') || currentPath.endsWith('/') || currentPath.endsWith('Art-Gallary-php')) {
        $('.top_menu li:nth-child(1)').addClass('active');
    } else if (currentPath.includes('about_us.html')) {
        $('.top_menu li:nth-child(2)').addClass('active');
    } else if (currentPath.includes('arts.html')) {
        $('.top_menu li:nth-child(3)').addClass('active');
    } else if (currentPath.includes('contact_us.html')) {
        $('.top_menu li:nth-child(4)').addClass('active');
    } else if (currentPath.includes('cart.html')) {
        $('.top_menu li:nth-child(5)').addClass('active');
    }

    // 2. Render Social Links
    const social = window.AG_DB.getSocialMedia();
    $('.social-icons .azm-facebook').attr('href', social.facebook);
    $('.social-icons .azm-twitter').attr('href', social.twitter);
    $('.social-icons .azm-linkedin').attr('href', social.linkedin);
    $('.social-icons .azm-instagram').attr('href', social.insta);

    // 3. User Session Header UI
    function updateHeaderUserUI() {
        const user = window.AG_DB.getCurrentUser();
        if (user) {
            $('.signup').html(`
                <li style="padding-top:15px; color:#9d9d9d; margin-right:15px;">
                    <span class="glyphicon glyphicon-user"></span> Hi, ${user.name}
                </li>
                <li>
                    <button id="logoutBtn" class="btn btn-link" style="padding-top:11.5px; color:#9d9d9d; text-decoration:none;">
                        <span class="glyphicon glyphicon-log-out"></span> Logout
                    </button>
                </li>
            `);
            $('#logoutBtn').click(function() {
                window.AG_DB.logoutUser();
                location.reload();
            });
        }
    }
    updateHeaderUserUI();

    // 4. User Sign Up Handle
    $('#register').submit(function(e) {
        e.preventDefault();
        const fname = $(this).find('input[name="fnm"]').val();
        const lname = $(this).find('input[name="lnm"]').val();
        const gender = $(this).find('input[name="gender"]:checked').val();
        const contact = $(this).find('input[name="contact"]').val();
        const email = $(this).find('input[name="email"]').val();
        const password = $(this).find('input[name="pwd"]').val();
        const confirmpwd = $(this).find('input[name="confirmpwd"]').val();
        const add1 = $(this).find('input[name="add1"]').val();
        const add2 = $(this).find('input[name="add2"]').val();
        const add3 = $(this).find('input[name="add3"]').val();

        if (!fname || !lname || !gender || !contact || !email || !password || !confirmpwd) {
            alert("Please fill in all required fields.");
            return;
        }

        if (password !== confirmpwd) {
            alert("Passwords do not match.");
            return;
        }

        const res = window.AG_DB.registerUser({
            fname, lname, gender, contact, email, password, add1, add2, add3
        });

        if (res.success) {
            alert("Registration successful! You can now log in.");
            $('#signup').modal('hide');
            $('#signin').modal('show');
        } else {
            alert(res.message);
        }
    });

    // 5. User Login Handle
    $('#signin form').submit(function(e) {
        e.preventDefault();
        const email = $('#username').val();
        const password = $(this).find('input[name="pass"]').val();

        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        const res = window.AG_DB.loginUser(email, password);
        if (res.success) {
            $('#signin').modal('hide');
            location.reload();
        } else {
            alert(res.message);
        }
    });

    // 6. Dynamic Content Injection for About Us page
    if (window.location.pathname.includes('about_us.html')) {
        $('.about_us_info').text(window.AG_DB.getAboutUs());
    }

    // 7. Dynamic Content Injection for Contact Us page
    if (window.location.pathname.includes('contact_us.html')) {
        const contact = window.AG_DB.getReachUs();
        const addressJumbotron = $('.address .jumbotron');
        if (addressJumbotron.length > 0) {
            addressJumbotron.html(`
                <p><strong>${contact.nm}</strong></p>
                <p>${contact.add1}</p>
                ${contact.add2 ? `<p>${contact.add2}</p>` : ''}
                <p>${contact.city}</p>
                <p>${contact.zipcode}</p>
                <p>${contact.state}</p>
                <br/>
                <p>Contact No: ${contact.contact_no}</p>
            `);
        }

        // Simulate Comment Submission
        $('.comment_form form').submit(function(e) {
            e.preventDefault();
            const name = $(this).find('input[placeholder="Enter Name"]').val();
            const email = $(this).find('input[placeholder="Email"]').val();
            const comment = $(this).find('textarea').val();

            if (!name || !email) {
                alert("Please fill in required fields (Name and Email).");
                return;
            }

            alert("Thank you for your comment!");
            $(this).trigger("reset");
        });
    }

    // 8. Add Cart functionality
    $(document).on('click', '.btn-add-cart', function(e) {
        e.preventDefault();
        const id = $(this).data('id');
        const arts = window.AG_DB.getArts();
        const art = arts.find(a => a.id == id);
        if (art) {
            window.AG_DB.addToCart(art);
            updateCartSidebar();
            alert(`${art.title} added to cart!`);
        }
    });

    // 9. Mini Cart Sidebar Hydration
    function updateCartSidebar() {
        const cart = window.AG_DB.getCart();
        const cartList = $('.cart_items ol');
        if (cartList.length > 0) {
            if (cart.length === 0) {
                cartList.html('<li style="list-style:none; padding:10px 0; color:#aaa;">Your cart is empty</li>');
            } else {
                let html = '';
                cart.forEach(item => {
                    html += `
                        <li style="margin-bottom:10px; list-style:decimal inside;">
                            <img src="${item.img}" alt="${item.title}" class="my_cart_items" style="width:30px; height:30px; object-fit:cover; margin-right:5px;">
                            <span class="my_cart_items_title" style="font-weight:bold;">${item.title}</span>
                            <span class="my_cart_items_price" style="float:right;">Rs. ${item.price} x ${item.quantity}</span>
                        </li>
                    `;
                });
                cartList.html(html);
            }
        }
    }
    updateCartSidebar();

    // 10. Cart Page Table Hydration & Handler
    if (window.location.pathname.includes('cart.html')) {
        function renderCartPage() {
            const cart = window.AG_DB.getCart();
            const tbody = $('.cart_table');
            if (tbody.length > 0) {
                let html = `
                    <tr style="font-weight:bolder">
                        <td></td>
                        <td></td>
                        <td>Product</td>
                        <td>Price</td>
                        <td>Quantity</td>
                        <td>Total</td>
                    </tr>
                `;
                
                if (cart.length === 0) {
                    html += `
                        <tr>
                            <td colspan="6" align="center" style="padding:20px; color:#aaa;">Your cart is empty.</td>
                        </tr>
                    `;
                } else {
                    let overallTotal = 0;
                    cart.forEach(item => {
                        const total = item.price * item.quantity;
                        overallTotal += total;
                        html += `
                            <tr data-id="${item.id}">
                                <td>	
                                    <span class="glyphicon glyphicon-remove remove-cart-item" aria-hidden="true" style="cursor:pointer; color:red;"></span>
                                </td>
                                <td>
                                    <img src="${item.img}" alt="${item.title}" class="my_cart_items" style="width:50px; height:50px; object-fit:cover;"/>
                                </td>
                                <td>
                                    <p>${item.title}</p>
                                </td>
                                <td>
                                    <p>Rs. ${item.price}</p>
                                </td>
                                <td>
                                    <div class="input-group q_item_group" style="width:100px;">
                                      <div class="input-group-addon add" style="cursor:pointer;">+</div>
                                      <center><label class="q_item" style="padding: 5px 10px; font-weight:normal;">${item.quantity}</label></center>
                                      <div class="input-group-addon remove" style="cursor:pointer;">-</div>
                                    </div>
                                </td>
                                <td>
                                    <p>Rs. <span class="total_price">${total}</span></p>
                                </td>
                            </tr>
                        `;
                    });

                    html += `
                        <tr style="font-weight:bold; background-color:#f9f9f9;">
                            <td colspan="4"></td>
                            <td>Grand Total:</td>
                            <td>Rs. ${overallTotal}</td>
                        </tr>
                        <tr>
                            <td colspan="4"></td>
                            <td><button class="btn btn-default" onclick="location.reload()">Update Cart</button></td>
                            <td><button class="btn btn-success checkout-btn">Proceed to Checkout</button></td>
                        </tr>
                    `;
                }
                tbody.html(html);
                
                // Bind click handlers
                $('.remove-cart-item').click(function() {
                    const id = $(this).closest('tr').data('id');
                    window.AG_DB.removeFromCart(id);
                    renderCartPage();
                });
                
                $('.q_item_group .add').click(function() {
                    const id = $(this).closest('tr').data('id');
                    window.AG_DB.updateCartQuantity(id, 1);
                    renderCartPage();
                });

                $('.q_item_group .remove').click(function() {
                    const id = $(this).closest('tr').data('id');
                    window.AG_DB.updateCartQuantity(id, -1);
                    renderCartPage();
                });

                $('.checkout-btn').click(function() {
                    if (!window.AG_DB.getCurrentUser()) {
                        alert("Please sign in or register to place your order.");
                        $('#signin').modal('show');
                        return;
                    }
                    alert("Order placed successfully! Thank you for purchasing from Art Gallery.");
                    window.AG_DB.saveCart([]);
                    renderCartPage();
                });
            }
        }
        renderCartPage();
    }
});
