---
title: 'Event Loop và Call Stack trong JavaScript: Bí Mật Đằng Sau Async'
description: 'Tìm hiểu cơ chế hoạt động bên trong của JavaScript engine và cách event loop xử lý các tác vụ bất đồng bộ'
pubDate: 'Dec 22 2024'
heroImage: '../../assets/blog-placeholder-3.jpg'
---

JavaScript là ngôn ngữ đơn luồng (single-threaded) nhưng có thể xử lý nhiều tác vụ đồng thời một cách hiệu quả. Phép màu đằng sau khả năng này nằm ở Vòng lặp sự kiện (Event Loop) và Ngăn xếp cuộc gọi (Call Stack). Hiểu những cơ chế này là nền tảng để viết code JavaScript hiệu năng cao và gỡ lỗi các vấn đề liên quan đến thời gian (timing). Bài viết này sẽ đi sâu vào hoạt động bên trong của JavaScript runtime.

## Call Stack - Cơ Chế Thực Thi Đồng Bộ

Call stack là cấu trúc dữ liệu lưu trữ thông tin về các hàm đang hoạt động trong chương trình. Nó hoạt động theo nguyên tắc LIFO (Last In, First Out - Vào sau, Ra trước) - hàm được gọi sau cùng sẽ hoàn thành trước. Mỗi khi một hàm được gọi, một ngữ cảnh thực thi (execution context) mới được đẩy lên stack. Khi hàm trả về, ngữ cảnh đó được lấy ra khỏi stack.

JavaScript engine duy trì một call stack duy nhất, đó là lý do tại sao JavaScript là đơn luồng. Chỉ một hàm có thể thực thi tại một thời điểm. Nếu hàm A gọi hàm B gọi hàm C, stack sẽ có ba khung (frames): A ở dưới cùng, B ở giữa, C ở trên cùng. Việc thực thi bắt đầu từ khung trên cùng (C) và làm việc xuống dưới.

Các khung stack chứa thông tin giá trị: tên hàm, đối số được truyền, biến cục bộ, địa chỉ trả về. Khi gỡ lỗi với debugger, stacktrace bạn thấy là hình ảnh trực quan của call stack. Hiểu call stack giúp diễn giải stacktraces lỗi và hiểu luồng thực thi chương trình. Các hàm đệ quy có thể gây tràn stack (stack overflow) nếu đệ quy quá sâu mà không có trường hợp cơ sở.

## Luồng Thực Thi Đồng Bộ

Trong code đồng bộ, các câu lệnh thực thi lần lượt theo thứ tự chúng xuất hiện. Call stack tăng và giảm khi các hàm được gọi và trả về. Việc thực thi diễn ra thẳng thắn và dễ đoán. Luồng chính (main thread) bị chặn (blocked) cho đến khi hoạt động hiện tại hoàn thành. Đây là hành vi mặc định và dễ tư duy nhất.

Vấn đề với code hoàn toàn đồng bộ là các hoạt động chặn (blocking operations). Yêu cầu mạng, I/O file, hay bộ hẹn giờ chặn việc thực thi, làm đóng băng toàn bộ ứng dụng. Trong trình duyệt, giao diện người dùng trở nên không phản hồi. Trong server, không thể xử lý các yêu cầu khác. Các ứng dụng thực tế yêu cầu I/O không chặn (non-blocking I/O) để duy trì khả năng phản hồi và thông lượng.

JavaScript giải quyết vấn đề này không phải thông qua đa luồng (multi-threading) như Java hay C++ mà thông qua các API bất đồng bộ và Event Loop. Thay vì chặn call stack, các hoạt động async được ủy quyền cho các API của trình duyệt (trong browser) hoặc libuv (trong Node.js). Call stack được giải phóng để tiếp tục công việc khác.

## Web APIs và Môi Trường Trình Duyệt

Trình duyệt cung cấp các API bên ngoài phạm vi JavaScript engine: `setTimeout`, `XMLHttpRequest`, `fetch`, sự kiện DOM, v.v. Khi gọi API async, trình duyệt xử lý hoạt động trong một luồng riêng biệt. JavaScript call stack không chờ đợi - tiếp tục thực thi câu lệnh tiếp theo ngay lập tức. Hoạt động async chạy song song với việc thực thi JavaScript.

Khi hoạt động async hoàn thành, callback không thực thi ngay lập tức. Thay vào đó, nó được xếp hàng để thực thi sau. Đây là điểm quan trọng: callbacks không làm gián đoạn việc thực thi hiện tại. Chúng chờ đến lượt trong hàng đợi. Event Loop chịu trách nhiệm giám sát hàng đợi và call stack, điều phối khi nào callbacks thực thi.

Sự tách biệt của JavaScript engine khỏi các API trình duyệt là rất quan trọng để hiểu hành vi async. Code JavaScript chạy đồng bộ trong call stack. Các hoạt động async được xử lý bởi runtime của trình duyệt. Event Loop là cầu nối giữa hai môi trường, đảm bảo callbacks thực thi vào thời điểm thích hợp mà không chặn luồng chính.

## Task Queue - Phòng Chờ Của Callback

Task Queue (hay Callback Queue, Macrotask Queue) là nơi các callbacks từ các hoạt động async chờ để thực thi. Khi `setTimeout` hết hạn, callback được thêm vào task queue. Khi `fetch` hoàn thành, callback được xếp hàng. Trình lắng nghe sự kiện DOM kích hoạt, callbacks được xếp hàng. Thứ tự FIFO (Vào trước, Ra trước) được duy trì - callback được xếp hàng đầu tiên là cái đầu tiên được thực thi.

Quy tắc chính: callbacks chỉ được chuyển từ hàng đợi sang call stack khi call stack rỗng. Event Loop liên tục kiểm tra: "Call stack có rỗng không? Nếu có, có callback nào đang chờ trong hàng đợi không?" Chỉ khi cả hai điều kiện đều đúng, callback mới được lấy ra khỏi hàng đợi và đẩy vào call stack để thực thi.

Hiểu hành vi xếp hàng giải thích nhiều hành vi về thời gian. `setTimeout(fn, 0)` không thực thi ngay lập tức - nó lên lịch cho callback thực thi sớm nhất có thể sau khi code hiện tại kết thúc và call stack trống. Độ trễ tối thiểu thực tế thường là 4ms do trình duyệt điều tiết. Callback có thể thực thi muộn hơn nhiều nếu call stack bận rộn với code đồng bộ chạy lâu.

## Event Loop - Người Điều Phối

Event Loop là một vòng lặp vô hạn giám sát call stack và task queue. Mã giả đơn giản: trong khi `true`, kiểm tra nếu call stack rỗng. Nếu có, kiểm tra task queue. Nếu có callbacks đang chờ, lấy callback đầu tiên ra và đẩy vào call stack. Lặp lại mãi mãi. Sự đơn giản này ẩn chứa sức mạnh - kích hoạt toàn bộ hệ sinh thái async.

Event Loop không phải là một phần của đặc tả ngôn ngữ JavaScript. Nó là một phần của môi trường runtime - trình duyệt hoặc Node.js. Các môi trường khác nhau có triển khai khác nhau nhưng về mặt khái niệm là tương tự. Hiểu mô hình Event Loop cho phép suy luận về thứ tự thực thi async và hành vi thời gian.

Cái nhìn quan trọng: JavaScript không bao giờ thực sự đồng thời (truly concurrent). Chỉ một đoạn code thực thi tại bất kỳ thời điểm nào. Sự đồng thời đạt được thông qua phân chia thời gian (time-slicing) - xen kẽ việc thực thi của các callbacks khác nhau. Event Loop là bộ lập lịch, quyết định cái gì thực thi khi nào. Code đồng bộ chạy lâu chặn Event Loop, ngăn các callbacks khác chạy.

## Microtask Queue - Làn Ưu Tiên

Microtask Queue (hay Job Queue) là hàng đợi riêng biệt với độ ưu tiên cao hơn Task Queue. Promises và callbacks của `MutationObserver` đi vào Microtask Queue. Sự khác biệt chính: microtasks được xử lý khác với tasks. Sau khi mỗi task hoàn thành, tất cả microtasks trong microtask queue được xử lý trước task tiếp theo.

Thứ tự: chạy một task, sau đó chạy tất cả microtasks, sau đó render (nếu cần), sau đó task tiếp theo. Microtasks có độ ưu tiên hiệu quả hơn tasks. Promise callbacks thực thi sớm hơn `setTimeout` callbacks được xếp hàng cùng lúc. Hiểu điều này rất quan trọng để dự đoán thứ tự thực thi trong code async phức tạp.

Microtask queue được làm trống hoàn toàn trước khi chuyển sang task tiếp theo. Nếu một microtask lên lịch một microtask khác, nó cũng được xử lý trước task tiếp theo. Về mặt lý thuyết có thể làm đói (starve) task queue bằng cách liên tục lên lịch microtasks. Trong thực tế, hiếm gặp nhưng có thể xảy ra - dấu hiệu của cấu trúc code có vấn đề.

## Ví Dụ Về Thứ Tự Thực Thi

Hiểu thứ tự thực thi đòi hỏi phải theo dõi cái gì là đồng bộ, cái gì là async, loại hàng đợi nào callback đi vào. Code đồng bộ luôn chạy trước - thực thi ngay lập tức từ trên xuống dưới. Sau đó xử lý tất cả microtasks. Cuối cùng xử lý task tiếp theo từ task queue. Lặp lại.

Promise handlers được xếp hàng như microtasks, `setTimeout` callbacks như tasks. `console.log` đồng bộ - thực thi ngay lập tức. `Promise.then()` callback không chạy cho đến khi code đồng bộ hiện tại kết thúc và các microtasks hiện có được xử lý. `setTimeout` callback có thể chờ lâu hơn nữa nếu có microtasks đang chờ.

Trường hợp khó: promise giải quyết đồng bộ vs bất đồng bộ. Executor của Promise constructor chạy đồng bộ. Gọi `resolve()` là đồng bộ, nhưng callback `then()` vẫn được xếp hàng như microtask. Không thể thực thi đồng bộ ngay cả khi promise đã được giải quyết khi `then()` được gắn vào. Đảm bảo hành vi async nhất quán.

## Tràn Ngăn Xếp (Call Stack Overflow)

Stack có kích thước hữu hạn. Hàm đệ quy không có trường hợp cơ sở thích hợp hoặc độ sâu quá lớn gây ra tràn stack. Thông báo lỗi: "Maximum call stack size exceeded". Mỗi khung stack tiêu tốn bộ nhớ. Quá nhiều khung làm cạn kiệt không gian stack có sẵn. Trình duyệt giới hạn thường khoảng 10,000-50,000 khung tùy thuộc vào trình duyệt và môi trường.

Ngăn chặn tràn stack yêu cầu đảm bảo đệ quy có trường hợp cơ sở và không đệ quy vô hạn. Tối ưu hóa cuộc gọi đuôi (Tail call optimization - TCO) trong ES6 về mặt lý thuyết cho phép độ sâu đệ quy không giới hạn cho các hàm đệ quy đuôi. Tuy nhiên, hiện tại chỉ Safari triển khai TCO. Các trình duyệt khác không triển khai do lo ngại về gỡ lỗi.

Giải pháp thay thế cho đệ quy là lặp (iteration). Vòng lặp `while` không làm tăng call stack. Chuyển đổi thuật toán đệ quy sang phiên bản lặp ngăn chặn tràn stack. Trampolining là kỹ thuật sử dụng vòng lặp và thunks để mô phỏng đệ quy mà không làm tăng stack. Hữu ích khi cần thuật toán đệ quy nhưng lo ngại về độ sâu stack.

## Chặn Event Loop

Code đồng bộ chạy lâu chặn Event Loop, ngăn callbacks thực thi và UI cập nhật. Tính toán chuyên sâu, vòng lặp lớn, hay thuật toán phức tạp có thể làm đóng băng ứng dụng. Quy tắc ngón tay cái: bất kỳ hoạt động nào tốn >16ms (một khung hình ở 60fps) đều có nguy cơ gây giật (jank) trong UI.

Chia nhỏ công việc thành các phần nhỏ ngăn chặn việc chặn. Thủ thuật `setTimeout(fn, 0)` lên lịch tiếp tục công việc như một task, cho phép Event Loop xử lý các callbacks khác giữa các phần. `requestAnimationFrame` tốt hơn cho hoạt ảnh, phối hợp với đường ống render của trình duyệt. Web Workers cho phép tính toán thực sự song song trong luồng riêng biệt.

Các công cụ phân tích (Profiling tools) trong DevTools trình duyệt trực quan hóa việc chặn Event Loop. Các task dài được hiển thị dưới dạng thanh đỏ trong timeline. Biểu đồ ngọn lửa (Flame graphs) hiển thị call stack trong các giai đoạn bị chặn. Xác định nút thắt cổ chai là bước đầu tiên trong tối ưu hóa. Đôi khi cần cải tiến thuật toán, lúc khác chia nhỏ công việc là đủ.

## Async/Await và Event Loop

Async/await được xây dựng trên promises, tận dụng microtask queue. `Await` tạm dừng thực thi hàm, cho phép Event Loop tiếp tục. Khi promise được `await` giải quyết, việc thực thi hàm tiếp tục từ nơi tạm dừng. Bên dưới lớp vỏ, trình biên dịch chuyển đổi async/await thành chuỗi promise.

Mỗi điểm `await` là một lần tạm dừng tiềm năng. Hàm có thể tiếp tục sau đó sau khi code khác đã thực thi. Trạng thái được bảo tồn qua các lần tạm dừng - biến cục bộ duy trì giá trị. Về mặt khái niệm tương tự như hàm generator với `yield`, nhưng được thiết kế đặc biệt cho các hoạt động async. Async/await làm cho code async trông giống đồng bộ trong khi vẫn duy trì hành vi không chặn.

Hiểu Event Loop là rất quan trọng để gỡ lỗi code async/await. Promise được `await` được xếp hàng như microtask. Việc thực thi tiếp tục sau khi task hiện tại và các microtasks hiện có hoàn thành. Nhiều `await` có nghĩa là nhiều chuyến đi qua Event Loop. Thứ tự thực thi với hỗn hợp promises, timeouts, và các câu lệnh `await` đòi hỏi suy luận cẩn thận.

## Các Giai Đoạn Event Loop trong Node.js

Event Loop của Node.js phức tạp hơn trình duyệt, được tổ chức thành các giai đoạn (phases). Mỗi giai đoạn có mục đích cụ thể: timers (`setTimeout`/`setInterval` callbacks), pending callbacks (I/O callbacks), idle/prepare (nội bộ), poll (lấy sự kiện I/O mới), check (`setImmediate` callbacks), close callbacks (`socket.on('close')`). Microtasks được xử lý giữa các giai đoạn.

`process.nextTick()` đặc biệt trong Node.js - độ ưu tiên cao hơn microtasks. Callbacks `nextTick` được xử lý sau khi hoạt động hiện tại hoàn thành, trước bất kỳ sự kiện I/O hay timers nào khác. Lạm dụng `nextTick` có thể làm đói các hoạt động I/O. Ưu tiên promises hơn `nextTick` trừ khi có lý do cụ thể.

`setImmediate()` và `setTimeout(fn, 0)` hành xử khác nhau trong Node.js. `setImmediate` thực thi trong giai đoạn check, `setTimeout` trong giai đoạn timer. Thứ tự thực thi phụ thuộc vào thời điểm được lên lịch. Trong chu trình I/O, `setImmediate` luôn thực thi trước. Hiểu các giai đoạn quan trọng cho phát triển JavaScript phía server.

## Gỡ Lỗi Các Vấn Đề Event Loop

Lỗi thời gian thường bắt nguồn từ việc hiểu sai hành vi Event Loop. "Race conditions" khi giả định thứ tự thực thi nhất định. Callbacks thực thi sau dự kiến. Thay đổi trạng thái xảy ra không theo thứ tự. Gỡ lỗi đòi hỏi suy luận về Event Loop, các loại hàng đợi, và thứ tự thực thi.

`console.log()` với các thông báo mô tả theo dõi thứ tự thực thi. Breakpoints trong DevTools trình duyệt trong code async khó khăn hơn - cần hiểu callbacks thực thi sau. Async stacktraces trong các trình duyệt hiện đại giúp theo dõi nguồn gốc của các hoạt động async. Phân tích hiệu năng (Performance profiling) tiết lộ các hoạt động chặn.

Kiểm thử code async đòi hỏi sự kiên nhẫn. Các bài test phải chờ cho các hoạt động async hoàn thành. Các framework kiểm thử cung cấp cơ chế: `done` callbacks, trả về promises, hay async/await trong hàm test. Các bài test chập chờn (flaky tests) thường do chờ đợi không đủ hoặc race conditions. Xử lý async đúng cách trong test phản ánh việc xử lý đúng cách trong code production.

## Thực Tiễn Tốt Nhất

Tránh chặn Event Loop. Giữ các hoạt động đồng bộ nhanh chóng. Chia nhỏ các tính toán chạy lâu thành các phần. Sử dụng Web Workers cho công việc tốn CPU. Phân tích (Profile) thường xuyên để xác định nút thắt. Các ứng dụng phản hồi nhanh yêu cầu tôn trọng các ràng buộc của Event Loop.

Hiểu thời gian callback. Đừng giả định thứ tự thực thi trừ khi được đảm bảo. Sử dụng promises hoặc async/await thay vì địa ngục callback. Nối chuỗi các hoạt động một cách rõ ràng thay vì dựa vào thời gian ngầm định. Race conditions chỉ ra các vấn đề kiến trúc cần tái cấu trúc.

Rò rỉ bộ nhớ trong code async thường từ các trình lắng nghe sự kiện không được dọn dẹp hoặc bộ hẹn giờ bị quên. Luôn dọn dẹp: loại bỏ listeners, xóa timeouts, hủy các yêu cầu đang chờ khi component unmount. Đặc biệt quan trọng trong các ứng dụng trang đơn (SPA) nơi các component mount và unmount thường xuyên.

## Kết Luận

Event Loop và Call Stack là trái tim của JavaScript runtime. Chúng cho phép ngôn ngữ đơn luồng xử lý các hoạt động async một cách hiệu quả. Hiểu các cơ chế này chuyển đổi từ việc hy vọng code hoạt động một cách mù quáng sang việc tự tin suy luận về hành vi thực thi.

Kiến thức sâu về Event Loop phân biệt lập trình viên trung cấp với cao cấp. Gỡ lỗi các vấn đề thời gian một cách có hệ thống. Thiết kế các hoạt động async một cách chính xác. Tối ưu hóa hiệu năng một cách thông minh. Tất cả đều yêu cầu mô hình tư duy vững chắc về Event Loop.

Tiếp tục khám phá: nghiên cứu các bảng hiệu năng trong DevTools trình duyệt, đọc về nội bộ V8 engine, thử nghiệm với các mẫu async khác nhau. Hiểu các nguyên tắc cơ bản của runtime cho phép viết code JavaScript tốt hơn. Kiến thức về Event Loop mang lại lợi ích trong suốt sự nghiệp làm lập trình viên JavaScript.