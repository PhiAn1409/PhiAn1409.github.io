---
title: 'Lập trình Bất đồng bộ trong JavaScript: Từ Callbacks đến Async/Await'
description: 'Khám phá cách JavaScript xử lý bất đồng bộ và sự tiến hóa từ callbacks, promises đến async/await'
pubDate: 'Dec 24 2024'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

JavaScript là một ngôn ngữ đơn luồng (single-threaded), nhưng nó có thể xử lý nhiều tác vụ đồng thời thông qua lập trình bất đồng bộ (asynchronous programming). Đây là một trong những khái niệm quan trọng nhất mà mọi lập trình viên JavaScript cần phải nắm vững. Bài viết này sẽ dẫn bạn qua hành trình của lập trình bất đồng bộ trong JavaScript, từ "địa ngục" callback đến cú pháp async/await hiện đại.

## Tại Sao Cần Lập Trình Bất Đồng Bộ?

Trong lập trình đồng bộ (synchronous programming), mã lệnh được thực thi tuần tự từ trên xuống dưới. Mỗi tác vụ phải hoàn thành trước khi tác vụ tiếp theo bắt đầu. Điều này đơn giản và dễ tư duy, nhưng có một vấn đề nghiêm trọng: sự tắc nghẽn (blocking). Nếu một tác vụ mất nhiều thời gian (như yêu cầu mạng hoặc đọc/ghi tệp), toàn bộ chương trình sẽ bị đóng băng để chờ đợi.

JavaScript chạy trong môi trường trình duyệt nơi trải nghiệm người dùng là tối quan trọng. Nếu một yêu cầu mạng chặn luồng chính (main thread) trong vài giây, giao diện người dùng sẽ bị treo - không thể nhấp vào nút, cuộn trang hay tương tác với bất cứ thứ gì. Điều này tạo ra trải nghiệm người dùng tồi tệ. Phía máy chủ với Node.js cũng tương tự - một tác vụ chậm chạp không nên chặn toàn bộ máy chủ khỏi việc xử lý các yêu cầu khác.

Lập trình bất đồng bộ giải quyết vấn đề này bằng cách cho phép các tác vụ chạy lâu thực thi trong nền (background). Luồng chính tiếp tục chạy, xử lý các tác vụ khác. Khi tác vụ bất đồng bộ hoàn tất, một hàm gọi lại (callback) được kích hoạt để xử lý kết quả. Cách tiếp cận này giữ cho ứng dụng phản hồi nhanh và hiệu quả, đặc biệt là khi xử lý các tác vụ I/O.

## Callbacks - Cách Tiếp Cận Đầu Tiên

Callbacks là các hàm được truyền dưới dạng tham số vào các hàm khác và được thực thi sau khi tác vụ bất đồng bộ hoàn tất. Đây là cách sớm nhất để xử lý mã bất đồng bộ trong JavaScript. Mô hình này đơn giản và trực quan: bạn cung cấp một hàm để "gọi lại" khi dữ liệu đã sẵn sàng.

Callbacks hoạt động tốt cho các trường hợp đơn giản, nhưng nhanh chóng trở thành vấn đề khi có nhiều tác vụ bất đồng bộ phụ thuộc lẫn nhau. Điều này dẫn đến khái niệm khét tiếng "callback hell" (địa ngục callback) hay "pyramid of doom" (kim tự tháp hủy diệt) - mã nguồn bị lồng nhau quá sâu với nhiều cấp độ callbacks. Cấu trúc mã trở nên phình to theo chiều ngang thay vì chiều dọc, cực kỳ khó đọc và bảo trì.

Xử lý lỗi với callbacks cũng là một thách thức. Không có cách chuẩn nào để lan truyền lỗi. Quy ước chung là truyền lỗi như tham số đầu tiên của callback (error-first callbacks), nhưng đây chỉ là quy ước, không phải tính năng của ngôn ngữ. Các lập trình viên phải kiểm tra và xử lý lỗi thủ công ở từng cấp độ, rất dễ bỏ sót và tạo ra lỗi (bugs).

## Promises - Bước Tiến Lớn

Promises được giới thiệu để giải quyết các hạn chế của callbacks. Một Promise là một đối tượng đại diện cho sự hoàn thành hoặc thất bại trong tương lai của một tác vụ bất đồng bộ. Promise có ba trạng thái: đang chờ (pending - trạng thái ban đầu), đã hoàn thành (fulfilled - tác vụ thành công), hoặc bị từ chối (rejected - tác vụ thất bại). Sự chuyển đổi trạng thái chỉ xảy ra một lần và không thể đảo ngược.

Promise cung cấp chuỗi phương thức (method chaining) với `then()` và `catch()`, làm cho mã bất đồng bộ dễ đọc và dễ tư duy hơn. Thay vì các callback lồng nhau, bạn nối chuỗi các promises theo chiều dọc. Mỗi `then()` trả về một promise mới, cho phép tiếp tục nối chuỗi. `Catch()` ở cuối chuỗi có thể bắt lỗi từ bất kỳ bước nào, đơn giản hóa đáng kể việc xử lý lỗi.

`Promise.all()` và `Promise.race()` là các tiện ích mạnh mẽ để xử lý nhiều promises. `Promise.all()` chờ cho tất cả các promises hoàn thành và trả về mảng các kết quả, hoặc từ chối nếu bất kỳ promise nào thất bại. `Promise.race()` trả về kết quả ngay khi promise đầu tiên được giải quyết. Những phương thức này cho phép thực hiện các mẫu điều phối bất đồng bộ phức tạp.

## Tạo và Sử Dụng Promises

Việc tạo promises khá trực quan với hàm khởi tạo (constructor) `Promise`. Constructor nhận vào một hàm executor với hai tham số `resolve` và `reject`. Bên trong executor, bạn thực hiện tác vụ bất đồng bộ rồi gọi `resolve` với kết quả hoặc `reject` với lỗi. Điều quan trọng là một promise nên đại diện cho một tác vụ bất đồng bộ đơn lẻ với kết quả thành công/thất bại rõ ràng.

Việc sử dụng promises được thực hiện với các phương thức `then()`, `catch()`, và `finally()`. `Then()` nhận tối đa hai callback: `onFulfilled` và `onRejected`. `Catch()` tương đương với `then(null, onRejected)`, chuyên dùng để xử lý lỗi. `Finally()` thực thi bất kể kết quả của promise ra sao, hữu ích cho các tác vụ dọn dẹp như đóng kết nối hoặc ẩn biểu tượng loading.

Chuỗi Promise rất mạnh mẽ vì callback trong `then()` có thể trả về một giá trị, một promise khác, hoặc ném ra một lỗi. Giá trị trả về sẽ tự động được bọc trong một promise, lan truyền xuống chuỗi. Các lỗi được ném ra sẽ tự động bị bắt và chuyển đến `catch()` tiếp theo trong chuỗi. Cơ chế này tạo ra một luồng trôi chảy cho cả dữ liệu và lỗi thông qua các tác vụ bất đồng bộ.

## Async/Await - Cú Pháp "Ngọt Ngào" Hiện Đại

Async/await được giới thiệu trong ES2017 là một bước ngoặt. Nó là "syntactic sugar" (lớp vỏ cú pháp) bao bọc lấy promises, làm cho mã bất đồng bộ trông giống và hoạt động như mã đồng bộ. Từ khóa `async` trước khai báo hàm làm cho hàm đó luôn trả về một promise. Từ khóa `await` chỉ được sử dụng bên trong các hàm `async`, nó tạm dừng việc thực thi cho đến khi promise được giải quyết.

Với async/await, không còn việc lồng nhau của callback hay nối chuỗi promise dài ngoằng. Mã nguồn được đọc từ trên xuống dưới giống như mã đồng bộ, cải thiện đáng kể khả năng đọc hiểu. Xử lý lỗi được thực hiện với các khối `try/catch` quen thuộc, giống hệt như mã đồng bộ. Điều này làm cho mã bất đồng bộ trở nên tự nhiên và trực quan đối với các lập trình viên chuyển từ nền tảng lập trình đồng bộ sang.

Bên dưới lớp vỏ bọc, async/await vẫn sử dụng promises. Trình biên dịch chuyển đổi mã async/await thành các chuỗi promise. Hiệu suất tương đương với chuỗi promise. Lợi ích thực sự nằm ở trải nghiệm của lập trình viên - mã dễ viết, dễ đọc và dễ bảo trì hơn. Async/await nhanh chóng trở thành cách ưa thích để xử lý các tác vụ bất đồng bộ trong JavaScript hiện đại.

## Chiến Lược Xử Lý Lỗi

Xử lý lỗi đúng cách là yếu tố cốt yếu trong mã bất đồng bộ. Với callbacks, các lỗi thường bị mất hoặc bị quên. Promises cải thiện tình hình với phương thức `catch()`, nhưng vẫn dễ quên việc nối chuỗi `catch()`. Async/await với các khối `try/catch` cung cấp cách tiếp cận xử lý lỗi quen thuộc và toàn diện nhất.

Các trình xử lý lỗi toàn cục (Global error handlers) cung cấp một lưới an toàn cho các promise bị từ chối mà không được xử lý (unhandled promise rejections). `Window.addEventListener('unhandledrejection')` trong trình duyệt và `process.on('unhandledRejection')` trong Node.js sẽ bắt các promises bị từ chối mà không có trình xử lý `catch`. Việc ghi log các lỗi này rất quan trọng để gỡ lỗi các vấn đề trong môi trường production.

Một mẫu thiết kế hữu ích là bọc mã async/await trong một hàm bậc cao (higher-order function) để tự động xử lý lỗi. Hàm này bắt các lỗi và chuyển chúng đến một trình xử lý lỗi tập trung. Cách tiếp cận này giảm thiểu mã lặp lại và đảm bảo xử lý lỗi nhất quán trên toàn bộ ứng dụng. Các thư viện như `express-async-errors` triển khai mẫu này cho các route của Express.js.

## Thực Thi Song Song và Tuần Tự

Hiểu khi nào chạy các tác vụ bất đồng bộ song song hay tuần tự là rất quan trọng cho hiệu suất. Thực thi tuần tự nghĩa là chờ cho mỗi tác vụ hoàn thành trước khi bắt đầu tác vụ tiếp theo. Điều này đơn giản với async/await nhưng chậm nếu các tác vụ độc lập với nhau. Tổng thời gian sẽ là tổng thời gian của từng tác vụ cộng lại.

Thực thi song song chạy nhiều tác vụ cùng một lúc, tổng thời gian xấp xỉ bằng thời gian của tác vụ dài nhất. `Promise.all()` hoàn hảo cho việc thực thi song song. Bạn truyền vào một mảng các promises và nó chờ cho tất cả hoàn thành. Nếu các tác vụ độc lập, thực thi song song sẽ nhanh hơn đáng kể. Tuy nhiên, nếu có sự phụ thuộc giữa các tác vụ, phải cẩn thận về thứ tự.

`Promise.allSettled()` hữu ích khi bạn muốn tất cả các tác vụ hoàn thành bất kể có lỗi hay không. Khác với `Promise.all()` (từ chối ngay khi có một promise thất bại), `allSettled()` chờ cho tất cả promises được giải quyết và trả về kết quả kèm theo trạng thái (fulfilled/rejected). Mẫu này hữu ích khi xử lý các tác vụ hàng loạt nơi mà việc một vài cá nhân thất bại là chấp nhận được.

## Lặp Bất Đồng Bộ và Streams

Async iterators mở rộng giao thức lặp cho các tác vụ bất đồng bộ. Vòng lặp `for-await-of` được giới thiệu trong ES2018 cho phép lặp qua các async iterables. Mỗi lần lặp sẽ `await` một promise trước khi tiếp tục. Mẫu này mạnh mẽ để xử lý các luồng dữ liệu (streams), như đọc các tệp lớn từng phần nhỏ hoặc tiêu thụ các API phân trang.

Async generators kết hợp generators với async/await. Một hàm async generator được khai báo với `async function*` và sử dụng `yield` để tạo ra các giá trị. Mỗi giá trị được yield ra sẽ được bọc trong một promise. Việc tiêu thụ async generator với `for-await-of` cung cấp một cách thanh lịch để làm việc với chuỗi các tác vụ bất đồng bộ.

Ví dụ thực tế là xử lý tập dữ liệu lớn từ API có phân trang. Hàm async generator tải các trang theo yêu cầu, trả về kết quả ngay khi chúng đến. Mã tiêu thụ sử dụng `for-await-of` để xử lý từng mục mà không cần tải toàn bộ tập dữ liệu vào bộ nhớ. Cách tiếp cận này tiết kiệm bộ nhớ và phản hồi nhanh.

## Kiểm Soát Đồng Thời và Giới Hạn Tốc Độ (Rate Limiting)

Khi xử lý nhiều tác vụ bất đồng bộ, đôi khi cần giới hạn mức độ đồng thời để tránh làm quá tải tài nguyên. Chạy hàng ngàn yêu cầu đồng thời có thể làm sập máy chủ hoặc vượt quá giới hạn tốc độ (rate limits) của API. Việc triển khai một "bể chứa" (pool) đồng thời đảm bảo chỉ một số lượng tác vụ nhất định chạy cùng lúc.

Mẫu này liên quan đến một hàng đợi các tác vụ đang chờ và một nhóm các tác vụ đang hoạt động. Khi một tác vụ hoàn thành, tác vụ tiếp theo từ hàng đợi sẽ bắt đầu. Các thư viện như `p-limit` cung cấp chức năng này ngay lập tức. Việc tự triển khai kiểm soát đồng thời sẽ giúp hiểu sâu hơn về các mẫu điều phối bất đồng bộ.

Giới hạn tốc độ (Rate limiting) mở rộng kiểm soát đồng thời bằng cách thêm các ràng buộc về thời gian. Đảm bảo không quá X yêu cầu trong mỗi Y giây. Hữu ích khi sử dụng các API bên thứ ba có giới hạn tốc độ. Việc triển khai liên quan đến theo dõi dấu thời gian của yêu cầu và trì hoãn yêu cầu khi cần thiết. Kết hợp giới hạn tốc độ với cơ chế thử lại (retries) và lùi lại theo cấp số nhân (exponential backoff) tạo ra một ứng dụng khách API mạnh mẽ.

## Kiểm Thử Mã Bất Đồng Bộ

Kiểm thử mã bất đồng bộ yêu cầu các phương pháp khác so với mã đồng bộ. Các framework kiểm thử cần biết khi nào các tác vụ bất đồng bộ hoàn thành. Các framework hiện đại như Jest, Mocha hỗ trợ promises và async/await một cách tự nhiên. Đơn giản là trả về một promise từ bài kiểm thử hoặc đánh dấu hàm kiểm thử là `async` và sử dụng `await`.

Giả lập (Mocking) các hàm bất đồng bộ là rất quan trọng cho kiểm thử đơn vị (unit testing). Các hàm mock của Jest có thể trả về promises, cho phép kiểm thử các luồng mã bất đồng bộ mà không cần thực hiện các tác vụ bất đồng bộ thực tế. Kiểm thử các trường hợp lỗi liên quan đến việc giả lập các promise bị từ chối hoặc ném lỗi trong các hàm async. Việc giả lập đúng cách đảm bảo các bài kiểm thử nhanh và đáng tin cậy.

Kiểm thử tích hợp với các tác vụ bất đồng bộ thực tế đòi hỏi thiết lập và dọn dẹp cẩn thận. Đảm bảo tài nguyên được dọn dẹp sau mỗi bài kiểm thử để tránh can nhiễu giữa các bài kiểm thử. Thời gian chờ (timeouts) rất quan trọng để ngăn các bài kiểm thử bị treo mãi mãi nếu tác vụ bất đồng bộ không bao giờ hoàn thành. Cân bằng giữa thời gian chờ thực tế và tốc độ thực thi kiểm thử là điều cần thiết.

## Các Quy Tắc Tốt Nhất và Cạm Bẫy Thường Gặp

Một lỗi phổ biến là quên từ khóa `await`. Gọi một hàm async mà không có `await` sẽ trả về một promise ngay lập tức, mã tiếp tục chạy mà không chờ đợi. Các quy tắc Linter như `require-await` và `no-floating-promises` giúp bắt các lỗi này. Luôn luôn `await` các hàm async trừ khi bạn thực sự muốn hành vi "kích hoạt và quên đi" (fire-and-forget).

Tránh trộn lẫn chuỗi promise với async/await một cách không cần thiết. Hãy tuân thủ một phong cách để đảm bảo sự nhất quán. Async/await thường được ưa thích hơn trong hầu hết các trường hợp vì khả năng đọc. Tuy nhiên, chuỗi promise đôi khi thích hợp hơn, đặc biệt là khi sử dụng nhiều `Promise.all()` hoặc khi không cần thực thi tuần tự.

Xử lý lỗi không nên bị bỏ qua. Mọi tác vụ bất đồng bộ đều có khả năng thất bại. Luôn bọc các lệnh gọi `await` trong `try/catch` hoặc gắn trình xử lý `catch()` vào các promises. Các promise bị từ chối mà không được xử lý có thể làm sập ứng dụng Node.js và tạo ra các vấn đề khó gỡ lỗi trong trình duyệt.

## Kết Luận

Lập trình bất đồng bộ đã biến đổi JavaScript từ một ngôn ngữ kịch bản đơn giản thành một nền tảng mạnh mẽ để xây dựng các ứng dụng phức tạp và phản hồi nhanh. Sự tiến hóa từ callbacks đến promises rồi đến async/await đại diện cho sự cải tiến liên tục trong trải nghiệm của lập trình viên trong khi vẫn duy trì khả năng tương thích ngược.

Làm chủ các mẫu bất đồng bộ là điều cần thiết cho phát triển JavaScript hiện đại. Cho dù xây dựng ứng dụng web, máy chủ hay CLI, mã bất đồng bộ là không thể tránh khỏi. Hiểu các nguyên tắc cơ bản - vòng lặp sự kiện (event loop), promises, async/await - và biết khi nào áp dụng từng mẫu sẽ cho phép viết mã bất đồng bộ hiệu quả và dễ bảo trì.

Thực hành là chìa khóa để làm chủ lập trình bất đồng bộ. Bắt đầu với các ví dụ đơn giản, dần dần giải quyết các kịch bản phức tạp. Gỡ lỗi mã bất đồng bộ để hiểu luồng thực thi. Đọc mã bất đồng bộ được viết tốt trong các thư viện phổ biến. Với thời gian và kinh nghiệm, tư duy bất đồng bộ sẽ trở thành phản xạ tự nhiên và bạn sẽ tận dụng các khả năng bất đồng bộ của JavaScript một cách hiệu quả.