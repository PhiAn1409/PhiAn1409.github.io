---
title: 'Hiểu Sâu về Closure trong JavaScript'
description: 'Khám phá một trong những khái niệm quan trọng nhất của JavaScript - Closure và cách nó hoạt động trong thực tế'
pubDate: 'Dec 26 2024'
heroImage: '../../assets/blog-placeholder-2.jpg'
---

Closure là một trong những khái niệm cốt lõi và quan trọng nhất của JavaScript, nhưng cũng là một trong những khái niệm khó hiểu nhất cho người mới. Bài viết này sẽ giúp bạn hiểu sâu về closure, tại sao nó quan trọng, và cách sử dụng nó hiệu quả trong các dự án thực tế.

## Closure Là Gì?

Closure là một hàm có khả năng "ghi nhớ" và truy cập vào phạm vi từ vựng (lexical scope) của nó, ngay cả khi hàm đó được thực thi bên ngoài phạm vi từ vựng ban đầu. Định nghĩa này nghe có vẻ phức tạp, nhưng ý tưởng cơ bản là: một hàm bên trong có thể truy cập vào biến của hàm bao ngoài, ngay cả sau khi hàm bao ngoài đã trả về (return).

Để hiểu closure, bạn cần hiểu ba khái niệm: phạm vi từ vựng (lexical scope), ngữ cảnh thực thi (execution context), và chuỗi phạm vi (scope chain). Lexical scope nghĩa là phạm vi được xác định khi viết code, không phải khi chạy code. Khi một hàm được tạo, nó "ghi nhớ" môi trường nơi nó được định nghĩa.

## Cách Closure Hoạt Động

Khi bạn định nghĩa một hàm bên trong một hàm khác, hàm con tự động tạo ra một closure. Hàm con này giữ một tham chiếu đến phạm vi của hàm cha, bao gồm tất cả các biến và tham số. Điều đặc biệt là ngay cả khi hàm cha đã thực thi xong và trả về, hàm con vẫn có thể truy cập vào các biến đó.

JavaScript engine quản lý closure thông qua thuộc tính ẩn gọi là scope chain. Mỗi hàm đều có một thuộc tính nội bộ trỏ đến outer scope của nó. Khi hàm con được gọi, JavaScript engine sẽ tìm kiếm biến theo thứ tự: phạm vi cục bộ của hàm con, rồi đến phạm vi của hàm cha, tiếp tục ra ngoài cho đến phạm vi toàn cục.

Quản lý bộ nhớ của closure rất thông minh. JavaScript engine chỉ giữ lại những biến mà closure thực sự sử dụng, không phải toàn bộ phạm vi. Điều này giúp tối ưu bộ nhớ nhưng cũng có thể gây rò rỉ bộ nhớ (memory leak) nếu không cẩn thận.

## Ứng Dụng Thực Tế của Closure

Một trong những trường hợp sử dụng phổ biến nhất của closure là tạo biến riêng tư (private variables). JavaScript không có từ khóa `private` như Java hay C++ (trước khi có class fields), nhưng closure cho phép bạn tạo ra sự đóng gói (encapsulation) tương tự. Bạn có thể tạo các biến chỉ có thể được truy cập và thay đổi thông qua các phương thức cụ thể, không thể truy cập trực tiếp từ bên ngoài.

Sự đóng gói dữ liệu này rất hữu ích khi xây dựng các module hoặc thư viện. Bạn có thể ẩn các chi tiết triển khai và chỉ lộ ra API công khai. Điều này giúp code dễ bảo trì hơn vì code bên ngoài không thể trực tiếp thay đổi trạng thái nội bộ, giảm khả năng gây lỗi và xung đột.

Closure cũng được sử dụng rộng rãi trong các trình xử lý sự kiện (event handlers) và callbacks. Khi bạn gắn một trình lắng nghe sự kiện, hàm callback đó tạo closure với phạm vi xung quanh. Điều này cho phép callback truy cập vào các biến cần thiết ngay cả khi sự kiện xảy ra sau nhiều giờ. Tuy nhiên, cần chú ý dọn dẹp các trình lắng nghe sự kiện để tránh rò rỉ bộ nhớ.

## Nhà Máy Hàm (Function Factories) và Ứng Dụng Một Phần (Partial Application)

Closure cho phép tạo function factories - các hàm trả về các hàm khác với hành vi được tùy chỉnh. Đây là một mẫu mạnh mẽ trong lập trình hàm (functional programming). Bạn có thể tạo các hàm chuyên biệt từ một hàm tổng quát bằng cách "gắn sẵn" một số tham số.

Partial application là kỹ thuật tạo hàm mới bằng cách cố định một số đối số của hàm gốc. Closure giúp triển khai mẫu này một cách tự nhiên. Hàm mới "nhớ" các đối số đã được cố định và chỉ cần nhận các đối số còn lại khi được gọi.

Currying là một dạng đặc biệt của partial application, nơi hàm nhận nhiều đối số được chuyển đổi thành chuỗi các hàm, mỗi hàm nhận một đối số. Closure là nền tảng cho mẫu currying, cho phép mỗi hàm trong chuỗi giữ lại đối số của nó và truyền xuống hàm tiếp theo.

## Closure trong Vòng Lặp - Cạm Bẫy Phổ Biến

Một trong những lỗi phổ biến nhất với closure xảy ra khi sử dụng closure trong vòng lặp, đặc biệt với `var`. Vì `var` có phạm vi hàm (function scope), không phải phạm vi khối (block scope), tất cả các lần lặp của vòng lặp sẽ chia sẻ cùng một biến. Khi closures được thực thi sau này, chúng đều tham chiếu đến giá trị cuối cùng của biến đó.

Trước ES6, các nhà phát triển phải dùng Biểu thức Hàm Thực thi Ngay lập tức (Immediately Invoked Function Expression - IIFE) để tạo phạm vi riêng cho mỗi lần lặp. IIFE tạo một ngữ cảnh thực thi mới với tham số riêng cho mỗi lần lặp, đảm bảo mỗi closure bắt giữ đúng giá trị.

ES6 giải quyết vấn đề này với `let` và `const`, có phạm vi khối. Khi dùng `let` trong vòng lặp `for`, mỗi lần lặp tạo một ràng buộc (binding) mới. Mỗi closure sẽ bắt giữ ràng buộc riêng của lần lặp đó, không còn chia sẻ chung biến như `var`.

## Cân Nhắc Về Hiệu Năng và Bộ Nhớ

Closure mạnh mẽ nhưng có chi phí. Mỗi closure giữ tham chiếu đến outer scope, tốn bộ nhớ. Nếu tạo hàng nghìn closures trong vòng lặp chặt, có thể ảnh hưởng hiệu năng. Trong code yêu cầu hiệu năng cao, cân nhắc giữa sự tiện lợi của closure và chi phí hiệu năng.

Rò rỉ bộ nhớ có thể xảy ra khi closure giữ tham chiếu đến các đối tượng lớn không cần thiết. Ví dụ, một closure trong event handler có thể giữ tham chiếu đến toàn bộ cây con DOM. Cần cẩn thận về phạm vi của closure và chỉ bắt giữ những gì thực sự cần.

Các JavaScript engines hiện đại tối ưu closure rất tốt. V8 engine phân tích closure và chỉ cấp phát bộ nhớ cho các biến thực sự được sử dụng. Tuy nhiên, không nên lạm dụng. Thực tiễn tốt nhất là hiểu sự đánh đổi và dùng closure khi lợi ích vượt trội chi phí.

## Closure và Từ Khóa This

Closure không bắt giữ ràng buộc `this`. `this` được xác định lúc chạy (runtime) dựa vào cách hàm được gọi, không phải nơi hàm được định nghĩa. Điều này có thể gây nhầm lẫn khi dùng closure với các phương thức của đối tượng.

Trước khi có arrow functions, các nhà phát triển thường gán `this` vào một biến (thường gọi là `self` hoặc `that`) để closure có thể truy cập. Arrow functions giải quyết vấn đề này bằng cách ràng buộc `this` theo từ vựng (lexically bind) - arrow function không có `this` riêng mà thừa hưởng `this` từ phạm vi bao quanh.

Sự khác biệt này giữa hàm thông thường và arrow functions về ràng buộc `this` rất quan trọng. Arrow functions tạo closure với `this`, trong khi hàm thông thường thì không. Hiểu điều này giúp bạn chọn đúng loại hàm cho từng tình huống.

## Closure trong JavaScript Hiện Đại

Với ES6+, closure được sử dụng nhiều hơn với các tính năng như modules, destructuring, và template literals. JavaScript modules tự động tạo closure - mỗi module có phạm vi riêng, biến không làm ô nhiễm phạm vi toàn cục. Default exports và named exports tận dụng closure để đóng gói nội bộ module.

Cú pháp Async/await kết hợp mượt mà với closure. Async functions có thể tạo closures như hàm thông thường. Biểu thức `await` bên trong closure có thể truy cập các biến outer scope một cách tự nhiên. Điều này làm code bất đồng bộ dễ đọc và dễ bảo trì hơn nhiều.

Hooks trong React là ví dụ điển hình của closure trong thực tế. `useState` và `useEffect` closures truy cập vào props và state từ phạm vi component. Hiểu closure là thiết yếu để hiểu cách React Hooks hoạt động và tránh các lỗi phổ biến như stale closures.

## Thực Tiễn Tốt Nhất với Closure

Sử dụng closure có mục đích rõ ràng, không lạm dụng nó. Closure tốt nhất cho bảo mật dữ liệu, nhà máy hàm, callbacks, và các mẫu lập trình hàm. Với các trường hợp đơn giản, có thể có các giải pháp thay thế đơn giản hơn không cần closure.

Chú ý phạm vi của closure. Chỉ bao gồm các biến thực sự cần thiết trong outer scope. Tránh closure bắt giữ không cần thiết các đối tượng lớn hay cấu trúc dữ liệu. Điều này giúp hiệu năng và ngăn rò rỉ bộ nhớ.

Tài liệu hóa hành vi closure trong chú thích code, đặc biệt khi logic phức tạp. Những người bảo trì tương lai (có thể là chính bạn) sẽ đánh giá cao việc hiểu tại sao closure được dùng và nó bắt giữ những gì. Quy ước đặt tên rõ ràng cũng giúp thể hiện ý định.

## Kết Luận

Closure là một trong những tính năng mạnh mẽ nhất của JavaScript, cho phép các mẫu khó triển khai trong nhiều ngôn ngữ khác. Nó là nền tảng cho nhiều khái niệm nâng cao như modules, currying, và lập trình hàm. Hiểu sâu closure giúp bạn viết code sạch hơn, dễ bảo trì hơn.

Tuy nhiên, sức mạnh lớn đi kèm trách nhiệm lớn. Closure có thể gây rò rỉ bộ nhớ và vấn đề hiệu năng nếu dùng không đúng cách. Thực tiễn tốt nhất là hiểu rõ cách closure hoạt động, khi nào nên dùng và khi nào không.

Làm chủ closure là cột mốc quan trọng trong hành trình JavaScript. Nó mở cửa cho các mẫu nâng cao và giúp bạn hiểu sâu hơn về cách JavaScript hoạt động bên dưới lớp vỏ. Thực hành với closure trong các dự án thực tế là cách tốt nhất để thực sự hiểu và đánh giá cao sức mạnh của nó.