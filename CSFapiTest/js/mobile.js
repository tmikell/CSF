// ########################
// GLOBAL VARS
// ########################
var theHREF;
var fixedOnScrollElOffset;
var fixedOnScrollEl;
var refElWidth;

// ########################
// DOCUMENT READY ITEMS
// ########################
$(document).ready(function () {

    $('body').on('click', function (e) {
        $('[data-toggle="popover"]').each(function () {
            //the 'is' for buttons that trigger popups
            //the 'has' for icons within a button that triggers a popup
            if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
                $(this).popover('hide');
            }
        });
    });

    // speedbump
    $(".confirmSpeedbump").click(function (e) {
        e.preventDefault();
        theHREF = $(this).attr("href");
        $('#speedBumpModal').modal('show')
    });
    $('#speedBumpModal').on('show.bs.modal', function (e) {
        $(this).find('#speedBumpContinue').attr('href', $(e.relatedTarget).data('href'));
    });
    $('#logoutSpeedBumpModal').on('show.bs.modal', function (e) {
        $(this).find('#logoutSpeedBumpContinue').attr('href', $(e.relatedTarget).data('href'));
    });
    // speedbump

    // back to top
    $('.back-to-top').click(function (event) {
        event.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 500);
        return false;
    })
    // back to top
    $('#closeAlertMsgBox').click(function (e) {
        HideAlertMsgBox();
        return false;
    });
    fixedOnScrollEl = $('.fixedOnScroll')
    fixedOnScrollElOffset = fixedOnScrollEl.offset();
    refElWidth = $('.fixedOnScrollRefEl')
});

// ########################
// WINDOWS SCROLL FUNCTIONS
// ########################
$(window).scroll(function () {
    // back to top
    if ($(window).scrollTop() > 220) {
        $('.back-to-top').fadeIn(500);
    } else {
        $('.back-to-top').fadeOut(500);
    }
    // fixedScroll
    if (fixedOnScrollElOffset != undefined) {
        if ($(window).scrollTop() > fixedOnScrollElOffset.top - 15) {
            fixedOnScrollEl.css('position', 'fixed').css('top', '0').css('z-index', '1030').css('padding-top', '15px').width(refElWidth.width());
            refElWidth.css('padding-top', fixedOnScrollEl.height() + 15);
        } else {
            fixedOnScrollEl.css('position', 'static').css('top', '').css('z-index', '').css('padding-top', '').removeAttr('width');
            refElWidth.css('padding-top', '');
        }
    }
});

// DOES NOT APPEAR TO WORK
//window.addEventListener("orientationchange", updateOrientation);
//$(window).bind("orientationchange", updateOrientation);
//function updateOrientation(e) {
//    alert(e.orientation);
//};
// WORKAROUND
var mediaTest = window.matchMedia("(orientation: portrait)");
mediaTest.addListener(function (m) {
    fixedOnScrollEl.width(refElWidth.width());
//    if (m.matches) {
//        // Changed to portrait
//    } else {
//        // Changed to landscape
//    }
});
function getWidth() {
    xWidth = null;
    if (window.screen != null)
        xWidth = window.screen.availWidth;

    if (window.innerWidth != null)
        xWidth = window.innerWidth;

    if (document.body != null)
        xWidth = document.body.clientWidth;

    return xWidth;
}
(function ($) {
    $.fn.idleTimeout = function (options) {
        var defaults = {
            inactivity: 1200000, //20 Minutes
            noconfirm: 10000, //10 Seconds
            sessionAlive: 600000, //10 Minutes
            redirect_url: '/mobile/logout.aspx?ReturnUrl=/mobile/messages/authorization/session_timeout.aspx',
            click_reset: true,
            alive_url: '/mobile/login.aspx',
            logout_url: '',
            showDialog: true,
            dialogTitle: 'Logout',
            dialogText: 'You are about to be signed out due to inactivity.',
            dialogButton: 'Stay Logged In'
        }

        var opts = $.extend(defaults, options);
        var liveTimeout, confTimeout, sessionTimeout;
        var modal = "<div id='modal_pop' class='modal fade bs-modal-sm' tabindex='-1' role='dialog' aria-labelledby='mySmallModalLabel' aria-hidden='true'><div class='modal-dialog modal-sm'><div class='modal-content'>";
        modal = modal + "<div class='modal-header'><h4 class='modal-title' id='myModalLabel'>" + opts.dialogTitle + "</h4></div>";
        modal = modal + "<div class='modal-body'><p>" + opts.dialogText + "<br/>Your session will expire in <span id='sessionTimeoutCountdown'></span> seconds.</p><p><button type='button' class='btn btn-primary' data-dismiss='modal'>" + opts.dialogButton + "</button></p></div>";
        modal = modal + "</div></div></div>";
        $('body').append(modal);
        var start_liveTimeout = function () {
            clearTimeout(liveTimeout);
            clearTimeout(confTimeout);
            liveTimeout = setTimeout(logout, opts.inactivity);

            if (opts.sessionAlive) {
                clearTimeout(sessionTimeout);
                sessionTimeout = setTimeout(keep_session, opts.sessionAlive);
            }
        }

        var logout = function () {
            $('#modal_pop').modal({
                keyboard: false,
                backdrop: 'static'
            });

            var counter = opts.noconfirm / 1000;
            confTimeout = setInterval(function () {
                counter -= 1;
                // if the counter is 0, redirect the user
                if (counter <= 0) {
                    redirect();
                } else {
                    $('#sessionTimeoutCountdown').html(counter);
                };
            }, 1000);
        }

        var redirect = function () {
            var loc = window.location;
            if (opts.logout_url) {
                $.get(loc.origin + opts.logout_url);
            }
            window.location.href = loc.origin + opts.redirect_url;
        }

        var stay_logged_in = function (el) {
            start_liveTimeout();
            if (opts.alive_url) {
                var loc = window.location;
                $.get(loc.origin + opts.alive_url);
            }
        }

        var keep_session = function () {
            var loc = window.location;
            $.get(loc.origin + opts.alive_url);
            clearTimeout(sessionTimeout);
            sessionTimeout = setTimeout(keep_session, opts.sessionAlive);
        }

        $('#modal_pop').on('hidden.bs.modal', function (e) {
            stay_logged_in();
        })

        //Build & Return the instance of the item as a plugin
        return this.each(function () {
            obj = $(this);
            start_liveTimeout();
            if (opts.click_reset) {
                $(document).bind('click', start_liveTimeout);
                $(document).bind('scroll', start_liveTimeout);
            }
            if (opts.sessionAlive) {
                keep_session();
            }
        });

    };
})(jQuery);

function PopUp(ref) {
    var strFeatures = "toolbar=0,status=no,menubar=no,location=no,title=no,resizable=yes,top=300,left=300,width=700,height=600,scrollbars=yes"
    newWin = window.open(ref, "TellObj", strFeatures);
    newWin.opener = top;
}

function SetAjaxUI(spinnerID, element2Hide) {
    var spinID = 'ajaxLoaderSpinner';
    if (spinnerID) { spinID = spinnerID }
    if ($("#" + spinID).hasClass("hidden")) {
        $("#" + spinID).removeClass("hidden");
        if (element2Hide) { $("#" + element2Hide).addClass("hidden"); }
    } else {
        $("#" + spinID).addClass("hidden");
        if (element2Hide) { $("#" + element2Hide).removeClass("hidden"); }
    }
}

function SeedAndDisplayAlertMsgBox(alertType, alertMsg) {
    if (alertType != "" && alertMsg != "") {
        $('div#alertMsgBox').addClass(alertType);
        $('div#alertMsgBox').css("display","block");
        $('span#alertMsg').html(alertMsg);
        $(window).scrollTop(0);
    }
}

function HideAlertMsgBox() {
    $('div#alertMsgBox').css("display","none");
}

function WriteFullSiteCookie() {
    document.cookie = "FullSiteMode=true;path=/";
    window.location.replace("/");
}