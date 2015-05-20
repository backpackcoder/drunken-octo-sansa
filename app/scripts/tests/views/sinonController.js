/* global describe, it, beforeEach, afterEach, expect, sinon, SinonController, hasClass */
'use strict';

(function () {
    describe('SinonController', function () {
        var testRequest404 = {
            url: '/expected-404',
            async: false,
            method: 'GET'
        };

        var testRequest1 = {
            url: '/test1',
            method: 'GET',
            data: null
        };

        var testRequest2 = {
            url: '/test2',
            method: 'PUT',
            data: '{ "id": 100 }'
        };


        function $ajax(req, successFn, errorFn) {
            var request = new XMLHttpRequest();
            request.open(req.method, req.url, true);

            request.onload = function () {
                if (request.status >= 200 && request.status < 400) {
                    var data = JSON.parse(request.responseText);
                    if (successFn) {
                        successFn(data);
                    }
                } else {
                    if (errorFn) {
                        errorFn(request, request.statusText, request.status);
                    }
                }
            };

            request.onerror = function () {
                errorFn(request, request.statusText, request.status);
            };
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(req.data);
        }

        beforeEach(function () {
            var t = this;
            this.sc = new SinonController({
                el: document.createElement('div')
            }).create();
            this.$ws = this.sc.el;
            this.clock = sinon.useFakeTimers();
            this.$ta = this.$ws.querySelector('textarea');
            this.$sel = this.$ws.querySelector('select[name="statusCode"]');
            this.$btn = this.$ws.querySelector('button[type="submit"]');
            this.$btnSave = this.$ws.querySelector('button.save-response');
            this.$btnNext = this.$ws.querySelector('button.next-response');
            this.$btnPrev = this.$ws.querySelector('button.prev-response');
            this.$btnClear = this.$ws.querySelector('button.clear-response');
            this.spanCounts = this.$ws.querySelector('span.count-response');

            /**
             * Expects "No Requests" text in the table
             */
            this.expectNoRequests = function () {
                var $tr = t.$ws.querySelectorAll('tbody tr');
                expect($tr.length).toEqual(0);
            };

            /**
             * Checks a row of request objects
             * @param rows
             */
            this.expectRows = function (rows) {
                var $tr = t.$ws.querySelectorAll('tbody tr');
                for (var i = rows.length - 1; i >= 0; i--) {
                    var $td = $tr[i].querySelectorAll('td');
                    expect($td[1].innerText).toEqual(rows[i].method);
                    expect($td[2].innerText).toEqual(rows[i].url);
                    expect($td[3].innerText).toEqual(rows[i].data || '');
                }
            };
        });


        afterEach(function () {
            this.clock.restore();
            delete(this.$ws);
        });


        it('can be started and stopped', function () {
            var t = this;

            function _sendAndExpect(request, rows) {
                $ajax(request);
                t.clock.tick(1100);
                t.expectRows(rows);
            }

            this.expectNoRequests();
            _sendAndExpect(testRequest404, []);
            this.expectNoRequests();
            this.sc.start();
            _sendAndExpect(testRequest1, [testRequest1]);
            this.sc.stop();
            _sendAndExpect(testRequest404, [testRequest1]);
        });


        it('should support multiple requests', function () {
            this.sc.start();
            var callback = sinon.spy(), errorCallback = sinon.spy();
            $ajax(testRequest1, callback, errorCallback);
            $ajax(testRequest2, callback, errorCallback);
            this.clock.tick(1200);
            this.$ta.value = '{ "id": 1 }';
            this.$btn.click();
            expect(callback.calledOnce).toBeTruthy();
            expect(callback.calledWith({ id: 1})).toBeTruthy();
            this.expectRows([testRequest2]);
            this.$sel.value = 400;
            this.$btn.click();
            expect(errorCallback.calledOnce).toBeTruthy();
            expect(errorCallback.calledWithMatch({ status: 400 })).toBeTruthy();
            this.expectNoRequests();
            this.sc.stop();
        });


        it('should disable/enable send response button', function () {
            this.sc.start();
            var t = this, event = null;

            function _setStatus(status) {
                t.$sel.vale = status;
                event = document.createEvent('HTMLEvents');
                event.initEvent('change', true, false);
                t.$sel.dispatchEvent(event);
            }

            function _setBody(body) {
                t.$ta.value = body;
                event = document.createEvent('HTMLEvents');
                event.initEvent('keyup', true, false);
                t.$ta.dispatchEvent(event);
            }

            // non 200, no request
            _setStatus(400);
            expect(this.$btn.getAttribute('disabled')).toBeTruthy();

            // non 200, request
            $ajax(testRequest1);
            this.clock.tick(1500);
            _setStatus(500);
            expect(this.$btn.getAttribute('disabled')).toBeFalsy();

            // 200, request, empty text
            _setStatus(200);
            _setBody('   ');
            expect(this.$btn.getAttribute('disabled')).toBeFalsy();

            // 200, request, invalid text
            _setStatus(200);
            _setBody('{ "id": 1');
            expect(hasClass(this.$ta, 'error')).toBeTruthy();
            expect(this.$btn.getAttribute('disabled')).toBeTruthy();

            // 200, request, valid text
            _setStatus(200);
            _setBody('{ "id": 1 }');
            expect(hasClass(this.$ta, 'error')).toBeFalsy();
            expect(this.$btn.getAttribute('disabled')).toBeFalsy();
        });

        it('should save, load, clear responses', function() {
            var str1 = '{ "id": 1, "text": "string #1" }';
            var str2 = '{ "id": 2, "text": "string #2" }';
            this.sc.start();

            var e = document.createEvent('HTMLEvents');
            e.initEvent('click', true, false);
            this.$btnClear.dispatchEvent(e);
            expect(this.spanCounts.innerText).toBe('0/0');

            // Test save button disable state
            expect(this.$btnSave.getAttribute('disabled')).toBeTruthy();
            this.$ta.value = str1;

            e = document.createEvent('HTMLEvents');
            e.initEvent('keyup', true, false);
            this.$ta.dispatchEvent(e);

            expect(this.$btnSave.getAttribute('disabled')).toBeFalsy();

            // save some json
            e = document.createEvent('HTMLEvents');
            e.initEvent('click', true, false);
            this.$btnSave.dispatchEvent(e);
            expect(this.spanCounts.innerText).toBe('1/1');

            // Bring it back
            this.$ta.value = '';
            e = document.createEvent('HTMLEvents');
            e.initEvent('click', true, false);
            this.$btnNext.dispatchEvent(e);
            expect(this.$ta.value).toBe(str1);

            // Save String 2
            this.$ta.value = str2;
            e = document.createEvent('HTMLEvents');
            e.initEvent('click', true, false);
            this.$btnSave.dispatchEvent(e);
            expect(this.spanCounts.innerText).toBe('1/2');

            // Next button
            this.$ta.value = '';
            this.$btnNext.click();
            expect(this.$ta.value).toBe(str2);
            expect(this.spanCounts.innerText).toBe('2/2');

            // Next button
            this.$ta.value = '';
            this.$btnNext.click();
            expect(this.$ta.value).toBe(str1);
            expect(this.spanCounts.innerText).toBe('1/2');

            // Prev button
            this.$ta.value = '';
            this.$btnPrev.click();
            expect(this.$ta.value).toBe(str2);
            expect(this.spanCounts.innerText).toBe('2/2');

            // Prev button
            this.$ta.value = '';
            this.$btnPrev.click();
            expect(this.$ta.value).toBe(str1);
            expect(this.spanCounts.innerText).toBe('1/2');

            // Clear button
            this.$ta.value = '';
            this.$btnClear.click();
            expect(this.spanCounts.innerText).toBe('0/0');
        });
    });
})();
