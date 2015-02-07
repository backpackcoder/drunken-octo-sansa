/*global describe, it, SinonController, $ */
'use strict';

(function () {
    var $workspace = $('<div></div>');


    describe('SinonController', function () {
        beforeEach(function() {
            $workspace.empty();
            this.clock = sinon.useFakeTimers();
        });

        afterEach(function() {
            $workspace.empty();
            this.clock.restore();
        });

        it('can be stopped', function(){
            var sc = new SinonController({
                el: $workspace[0]
            });
            sc.render();
            expect($workspace.find('li').length).toEqual(1);
            expect($workspace.find('li').text()).toEqual("No requests");

            $.ajax('/expected-404', {
                async: false,
                method: 'GET'
            });
            sc.render();
            expect($workspace.find('li').length).toEqual(1);
            expect($workspace.find('li').text()).toEqual("No requests");

            sc.start();
            $.ajax('/test1', {
                method: 'GET'
            });
            sc.render();
            expect($workspace.find('li').length).toEqual(1);
            expect($workspace.find('li').text()).toEqual("/test1");
            sc.stop();

            $.ajax('/expected-404', {
                method: 'GET'
            });
            sc.render();
            expect($workspace.find('li').length).toEqual(1);
            expect($workspace.find('li').text()).toEqual("/test1");
        });

        it('should list requests', function () {
            var sc = new SinonController({
                el: $workspace[0]
            });
            sc.render();
            expect($workspace.find('li').length).toEqual(1);
            expect($workspace.find('li').text()).toEqual("No requests");

            sc.start();
            $.ajax('/test1', {
                method: 'GET'
            });
            sc.render();
            expect($workspace.find('li').length).toEqual(1);
            expect($workspace.find('li').text()).toEqual("/test1");

            $.ajax('/test2', {
                method: 'GET'
            });

            sc.render();
            expect($workspace.find('li').length).toEqual(2);
            expect($workspace.find('li:first-child').text()).toEqual("/test1");
            expect($workspace.find('li:last-child').text()).toEqual("/test2");
            sc.stop();
        });

        it('should respond to a request', function(){
            var ws = $('<div class="display: none;"></div>');
            $workspace.append(ws);
            var sc = new SinonController({
                el: ws[0]
            });
            sc.render();
            expect(ws.find('li').length).toEqual(1);
            expect(ws.find('li').text()).toEqual("No requests");
            expect(ws.find('button').prop('disabled')).toBeTruthy();

            sc.start();
            var callback = sinon.spy();
            $.ajax('/test3', {
                method: 'GET',
                success: callback
            });
            sc.render();
            ws.find('textarea').val('{ "id": 1 }');
            ws.find('button').click();
            expect(callback.calledOnce).toBeTruthy();
            expect(callback.calledWith({ id: 1})).toBeTruthy();
            expect(ws.find('li').length).toBe(1);
            expect(ws.find('li').text()).toEqual('No requests');
            sc.stop();
            ws.remove();
        });

        it('should support multiple requests', function() {
            var ws = $('<div class="display: none;"></div>');
            $workspace.append(ws);
            var sc = new SinonController({
                el: ws[0]
            });
            sc.render();
            expect(ws.find('li').length).toEqual(1);
            expect(ws.find('li').text()).toEqual("No requests");

            sc.start();
            var callback = sinon.spy();
            $.ajax('/test1', {
                method: 'GET',
                success: callback
            });
            $.ajax('/test2', {
                method: 'GET',
                success: callback
            });
            sc.render();
            expect(ws.find('button').prop('disabled')).toBeFalsy();
            ws.find('textarea').val('{ "id": 1 }');
            ws.find('button').click();
            expect(callback.calledOnce).toBeTruthy();
            expect(callback.calledWith({ id: 1})).toBeTruthy();
            expect(ws.find('li').length).toBe(1);
            expect(ws.find('li').text()).toBe('/test2');

            ws.find('textarea').val('{ "id": 2 }');
            ws.find('button').click();
            expect(callback.callCount).toBe(2);
            expect(callback.calledWith({ id: 2})).toBeTruthy();
            expect(ws.find('li').length).toBe(1);
            expect(ws.find('li').text()).toEqual("No requests");
            expect(ws.find('button').prop('disabled')).toBeTruthy();
            sc.stop();
            ws.remove();
        });

        it('should preserve response text in render', function() {
            var ws = $('<div class="display: none;"></div>');
            $workspace.append(ws);
            var sc = new SinonController({
                el: ws[0]
            });
            sc.render();
            expect(ws.find('li').length).toEqual(1);
            expect(ws.find('li').text()).toEqual('No requests');
            expect(ws.find('button').prop('disabled')).toBeTruthy();
            ws.find('textarea').val('test text');
            sc.render();
            expect(ws.find('textarea').val()).toEqual('test text');
            ws.remove();
        });

        it('should auto update', function() {
            var ws = $('<div class="display: none;"></div>');
            $workspace.append(ws);
            var sc = new SinonController({
                el: ws[0]
            });
            sc.render();
            sc.start();
            expect(ws.find('li').length).toEqual(1);
            expect(ws.find('li').text()).toEqual('No requests');
            expect(ws.find('button').prop('disabled')).toBeTruthy();

            var callback = sinon.spy();
            $.ajax('/test1', {
                method: 'GET',
                success: callback
            });
            expect(ws.find('li').length).toEqual(1);
            expect(ws.find('li').text()).toEqual('No requests');
            expect(ws.find('button').prop('disabled')).toBeTruthy();

            this.clock.tick(1000);
            expect(ws.find('li').length).toEqual(1);
            expect(ws.find('li').text()).toEqual('/test1');
            expect(ws.find('button').prop('disabled')).toBeFalsy();
            sc.stop();
            ws.remove();
        });
    });
})();
