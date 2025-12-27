---
title: 'Thừa Kế Nguyên Mẫu (Prototypal Inheritance) trong JavaScript: Cơ Chế Độc Đáo'
description: 'Khám phá cơ chế thừa kế dựa trên prototype của JavaScript và sự khác biệt với thừa kế cổ điển (classical inheritance)'
pubDate: 'Dec 20 2024'
heroImage: '../../assets/blog-placeholder-2.jpg'
---

JavaScript sử dụng cơ chế thừa kế nguyên mẫu (prototypal inheritance), một cơ chế hoàn toàn khác biệt so với thừa kế cổ điển (classical inheritance) trong Java, C++, hay Python. Mặc dù ES6 đã thêm cú pháp `class`, về bản chất JavaScript vẫn dựa trên prototype. Hiểu sâu về prototypes là chìa khóa để thực sự hiểu JavaScript và tận dụng các tính năng độc đáo của nó một cách hiệu quả.

## Thừa Kế Cổ Điển (Classical) vs Thừa Kế Nguyên Mẫu (Prototypal)

Thừa kế cổ điển dựa trên các lớp (classes) - bản thiết kế cho các đối tượng. Bạn tạo một class, định nghĩa các thuộc tính và phương thức, rồi khởi tạo (instantiate) các đối tượng từ class đó. Sự thừa kế thông qua từ khóa `extends`, class con thừa hưởng từ class cha. Mối quan hệ giữa class và thể hiện (instance) là rõ ràng và cố định tại thời điểm biên dịch.

Thừa kế nguyên mẫu khác biệt về cơ bản. Không có các class theo nghĩa cổ điển. Các đối tượng thừa kế trực tiếp từ các đối tượng khác. Mỗi đối tượng có một liên kết nội bộ đến một đối tượng khác gọi là `prototype`. Nếu một thuộc tính không được tìm thấy trên đối tượng, JavaScript sẽ tìm kiếm trên chuỗi prototype cho đến khi tìm thấy thuộc tính hoặc đi đến điểm cuối của chuỗi.

Sự linh hoạt là lợi thế chính. Một đối tượng có thể thay đổi prototype của nó tại thời điểm chạy (runtime). Bạn có thể thêm các phương thức vào prototype, điều này sẽ ảnh hưởng đến tất cả các đối tượng chia sẻ prototype đó. Bạn có thể tạo các đối tượng với prototype tùy ý. Không bị ràng buộc bởi các phân cấp lớp cứng nhắc. Tuy nhiên, sự linh hoạt này cũng có thể gây nhầm lẫn cho các lập trình viên đến từ nền tảng OOP cổ điển.

## Chuỗi Prototype (Prototype Chain)

Mỗi đối tượng JavaScript có một thuộc tính ẩn gọi là prototype (có thể truy cập qua `Object.getPrototypeOf()` hoặc thuộc tính `__proto__`, mặc dù `__proto__` đã bị loại bỏ). Khi truy cập một thuộc tính trên đối tượng, JavaScript trước tiên kiểm tra chính đối tượng đó. Nếu không tìm thấy, nó kiểm tra prototype của đối tượng, rồi đến prototype của prototype đó, tiếp tục cho đến khi kết thúc chuỗi.

Chuỗi kết thúc tại `Object.prototype`, prototype của hầu hết các đối tượng. Prototype của `Object.prototype` là `null`, chấm dứt chuỗi. Nếu thuộc tính không được tìm thấy ở bất cứ đâu trong chuỗi, nó trả về `undefined`. Cơ chế này trong suốt - bạn truy cập các thuộc tính như thể chúng nằm trực tiếp trên đối tượng, trình biên dịch sẽ xử lý việc duyệt chuỗi.

Hiện tượng che khuất (Shadowing) xảy ra khi một đối tượng có thuộc tính cùng tên với một thuộc tính trong chuỗi prototype. Thuộc tính riêng của đối tượng sẽ che khuất thuộc tính của prototype - việc tìm kiếm dừng lại ở đối tượng, không tiếp tục lên chuỗi. Bạn có thể cố ý che khuất các thuộc tính để ghi đè hành vi. Hiểu về shadowing là rất quan trọng để tránh lỗi và thiết kế các phân cấp thừa kế.

## Hàm Khởi Tạo (Constructor Functions) và Từ Khóa new

Trước khi có ES6 classes, hàm khởi tạo là cách tiêu chuẩn để tạo các đối tượng với hành vi được chia sẻ. Hàm khởi tạo là một hàm thông thường, theo quy ước được đặt tên viết hoa chữ cái đầu. Khi được gọi với từ khóa `new`, nó tạo ra một đối tượng mới, thiết lập prototype cho đối tượng đó, ràng buộc `this` vào đối tượng mới, và trả về đối tượng.

Từ khóa `new` thực hiện bốn bước: tạo một đối tượng rỗng, thiết lập prototype của đối tượng đến thuộc tính `prototype` của hàm khởi tạo, thực thi hàm khởi tạo với `this` được ràng buộc vào đối tượng, và trả về đối tượng (trừ khi hàm khởi tạo trả về một đối tượng khác một cách rõ ràng). Thuộc tính `prototype` của hàm khởi tạo (không phải prototype riêng của hàm đó) trở thành prototype của các thể hiện (instances).

Mọi hàm đều có thuộc tính `prototype` (đừng nhầm lẫn với prototype riêng của hàm). Thuộc tính này ban đầu là một đối tượng với thuộc tính `constructor` trỏ ngược lại hàm đó. Thêm các phương thức vào `prototype` của hàm khởi tạo để chia sẻ chúng giữa tất cả các thể hiện. Các phương thức instance được định nghĩa bên trong hàm khởi tạo là riêng biệt cho từng instance, không được chia sẻ, gây tốn bộ nhớ hơn.

## Object.create() - Thừa Kế Nguyên Mẫu Trực Tiếp

`Object.create()` cung cấp một cách trực tiếp hơn để tạo các đối tượng với một prototype cụ thể. Truyền đối tượng cần dùng làm prototype, nó trả về một đối tượng mới với prototype đó. Không liên quan đến hàm khởi tạo hay từ khóa `new`. Đây là cách tiếp cận rõ ràng và linh hoạt hơn đối với thừa kế nguyên mẫu.

`Object.create()` cho phép tạo các đối tượng không thừa kế từ `Object.prototype`. Truyền `null` để tạo một đối tượng thực sự rỗng mà không có bất kỳ thuộc tính thừa kế nào. Hữu ích khi tạo từ điển (dictionaries) hay bản đồ (maps) nơi bạn không muốn các thuộc tính thừa kế gây nhiễu. Cũng hữu ích để tạo các đối tượng với prototype tùy ý.

Mô hình thừa kế vi sai (Differential inheritance) tận dụng `Object.create()` một cách hiệu quả. Bắt đầu với một đối tượng cơ sở chứa hành vi mặc định. Tạo các đối tượng mới thừa kế từ cơ sở, chỉ ghi đè những thuộc tính cần tùy chỉnh. Các đối tượng mới chia sẻ phần lớn chức năng từ prototype, chỉ định nghĩa những điểm khác biệt. Tiết kiệm bộ nhớ và tuân thủ nguyên tắc DRY (Don't Repeat Yourself).

## ES6 Classes - Lớp Vỏ Cú Pháp (Syntactic Sugar)

ES6 giới thiệu cú pháp `class`, trông giống với các ngôn ngữ OOP cổ điển. Tuy nhiên, các class trong JavaScript là lớp vỏ cú pháp bao bọc hệ thống dựa trên prototype hiện có. Khai báo class tạo ra một hàm khởi tạo và thiết lập chuỗi prototype chính xác như cách làm thủ công. Bên dưới lớp vỏ, nó vẫn là thừa kế nguyên mẫu.

Cú pháp class cung cấp cách sạch sẽ và trực quan hơn để định nghĩa các hàm khởi tạo và phương thức. Phương thức `constructor` tự động được gọi khi một instance mới được tạo. Các phương thức được định nghĩa trong thân class tự động được thêm vào prototype. Từ khóa `extends` thiết lập chuỗi prototype cho việc thừa kế. Từ khóa `super` truy cập các phương thức của class cha.

Quan trọng là phải hiểu rằng class không thay đổi bản chất của JavaScript. Chúng là cú pháp tiện lợi giúp code dễ đọc và quen thuộc hơn với các lập trình viên từ nền tảng OOP cổ điển. Việc biết cơ chế prototype bên dưới vẫn rất quan trọng vì nhiều mô hình và thư viện sử dụng prototype trực tiếp. Classes và prototypes có thể tương tác - bạn có thể kết hợp cả hai cách tiếp cận.

## Ủy Quyền Phương Thức (Method Delegation) và Chia Sẻ Hành Vi

Thừa kế nguyên mẫu chủ yếu là về sự ủy quyền (delegation) thay vì sao chép (copying). Khi gọi một phương thức trên đối tượng, phương thức được thực thi trong ngữ cảnh của đối tượng ngay cả khi phương thức được định nghĩa trên prototype. Ràng buộc `this` trỏ vào đối tượng, không phải prototype. Sự ủy quyền cho phép chia sẻ hành vi một cách hiệu quả.

Hành vi được chia sẻ thông qua chuỗi prototype, không bị sao chép qua các instance. Hàng trăm đối tượng có thể chia sẻ các phương thức từ một prototype, tiết kiệm bộ nhớ. Trái ngược với việc sao chép từng phương thức vào mỗi instance. Các phương thức được chia sẻ truy cập dữ liệu riêng của từng instance thông qua `this`, cung cấp hành vi riêng biệt cho từng instance mặc dù dùng chung code.

Ủy quyền linh hoạt hơn sao chép. Bạn có thể thay đổi các phương thức của prototype và những thay đổi đó ngay lập tức ảnh hưởng đến tất cả các đối tượng sử dụng prototype đó. Hữu ích cho việc thay nóng (hot-swapping) các triển khai, cờ tính năng (feature flags), hay thay đổi hành vi động. Tuy nhiên, cần thận trọng khi sửa đổi - có thể gây tác dụng phụ không mong muốn nếu nhiều phần của code phụ thuộc vào prototype đó.

## Ô Nhiễm Prototype (Prototype Pollution) và Bảo Mật

Ô nhiễm prototype là một lỗ hổng bảo mật nơi kẻ tấn công sửa đổi prototype của các đối tượng, ảnh hưởng đến tất cả các đối tượng chia sẻ prototype đó. Đặc biệt nguy hiểm với `Object.prototype` vì hầu hết các đối tượng đều thừa kế từ nó. Kẻ tấn công có thể tiêm các thuộc tính hoặc phương thức độc hại, được thực thi trong ngữ cảnh của ứng dụng.

Lỗ hổng này thường bị khai thác thông qua việc phân tích cú pháp JSON hoặc gộp (merging) đầu vào của người dùng vào các đối tượng mà không kiểm tra. Cần làm sạch đầu vào cẩn thận, tránh gán trực tiếp các key do người dùng kiểm soát vào đối tượng. Sử dụng `Object.create(null)` cho các đối tượng lưu trữ dữ liệu người dùng. `Object.freeze()` ngăn chặn việc sửa đổi prototype.

Kiểm tra `hasOwnProperty()` là rất quan trọng khi lặp qua các thuộc tính của đối tượng. Phân biệt giữa thuộc tính riêng của đối tượng và thuộc tính thừa kế. Vòng lặp `for...in` lặp qua cả các thuộc tính đếm được (enumerable) được thừa kế trừ khi kiểm tra `hasOwnProperty()`. `for...of` và `Object.keys()` hiện đại chỉ lặp qua các thuộc tính riêng, là các lựa chọn thay thế an toàn hơn.

## Bộ Mô Tả Thuộc Tính (Property Descriptors) và Prototype

Các thuộc tính có các bộ mô tả kiểm soát hành vi: `value` (giá trị), `writable` (có thể ghi), `enumerable` (có thể liệt kê), `configurable` (có thể cấu hình). `Object.defineProperty()` thiết lập các bộ mô tả một cách rõ ràng. Các thuộc tính của prototype cũng có các bộ mô tả. Hiểu về bộ mô tả rất quan trọng để kiểm soát hành vi thuộc tính qua chuỗi thừa kế.

Bộ mô tả `writable` kiểm soát xem thuộc tính có thể được gán lại hay không. `Enumerable` kiểm soát xem thuộc tính có hiển thị trong vòng lặp `for...in` và `Object.keys()` hay không. `Configurable` kiểm soát xem thuộc tính có thể bị xóa hoặc thay đổi bộ mô tả hay không. Các thuộc tính không thể cấu hình (non-configurable) sẽ cố định vĩnh viễn, ngay cả trên prototype.

Getters và setters có thể được định nghĩa trên prototype. Khi thuộc tính được truy cập trên instance, getter/setter từ prototype được gọi. Điều này cho phép các thuộc tính tính toán (computed properties) được chia sẻ giữa các instance. Hữu ích để triển khai các giao diện (interfaces) hoặc trừu tượng hóa việc truy cập thuộc tính. Tuy nhiên, getters/setters thêm chi phí xử lý, hãy sử dụng một cách thận trọng.

## Mixins và Composition (Kết Hợp)

Các prototype linh hoạt của JavaScript cho phép các mô hình kết hợp như mixins. Mixin là một đối tượng chứa các phương thức có thể được sao chép vào các đối tượng hoặc prototype khác. Không giống như thừa kế (quan hệ "là một" - is-a), mixins cung cấp khả năng "có một" (has-a). Nhiều mixins được kết hợp với nhau tạo ra hành vi phức tạp từ những mảnh đơn giản.

`Object.assign()` là cách phổ biến để áp dụng mixins. Sao chép các thuộc tính từ đối tượng nguồn sang đối tượng đích. Có thể áp dụng nhiều mixins tuần tự, xây dựng dần chức năng. Mô hình mixin tránh được các phân cấp thừa kế sâu, ủng hộ việc kết hợp phẳng (flat composition). Dễ hiểu và bảo trì hơn so với thừa kế đa cấp.

Composition (kết hợp) thường được ưa chuộng hơn thừa kế trong JavaScript hiện đại. Nguyên tắc "Ưu tiên kết hợp hơn thừa kế" (Favor composition over inheritance) được áp dụng. Kết hợp các đối tượng từ những mảnh nhỏ, tập trung thay vì xây dựng các phân cấp lớp cứng nhắc. Prototype vẫn hữu ích cho việc ủy quyền cơ bản, nhưng các phân cấp phức tạp thường gây vấn đề. Giữ cho thừa kế nông (shallow), sử dụng kết hợp cho sự phức tạp.

## Instanceof và Kiểm Tra Kiểu (Type Checking)

Toán tử `instanceof` kiểm tra xem thuộc tính `prototype` của hàm khởi tạo có nằm trong chuỗi prototype của đối tượng hay không. Không hoàn toàn chính xác - thất bại qua các ngữ cảnh thực thi khác nhau (như iframes) nơi mỗi ngữ cảnh có các hàm khởi tạo có sẵn riêng biệt. Cũng thất bại nếu prototype bị thay đổi rõ ràng.

Kiểm tra kiểu đáng tin cậy hơn sử dụng `Object.prototype.toString.call(obj)` hoặc kiểm tra các thuộc tính/phương thức cụ thể (duck typing - "nếu nó đi như vịt và kêu như vịt thì nó là vịt"). Code hiện đại ngày càng ưa chuộng duck typing hơn `instanceof`. Nếu đối tượng có các phương thức cần thiết, không quan trọng "kiểu" của nó là gì. Linh hoạt hơn và đúng chất JavaScript hơn.

`Symbol.hasInstance` cho phép tùy chỉnh hành vi của `instanceof`. Định nghĩa phương thức tĩnh `[Symbol.hasInstance]` trong class để kiểm soát các lần kiểm tra `instanceof`. Cho phép kiểm tra kiểu tinh vi hơn là chỉ đi bộ qua chuỗi prototype. Hữu ích để triển khai các hệ thống kiểu hoặc phân cấp lớp đặc thù của framework.

## Cân Nhắc Về Hiệu Năng

Việc tìm kiếm trên prototype có chi phí. Mỗi bước lên chuỗi đòi hỏi một lần kiểm tra. Chuỗi sâu tệ hơn chuỗi nông. Tuy nhiên, các engine JavaScript hiện đại tối ưu hóa rất mạnh việc tìm kiếm prototype với bộ nhớ đệm nội dòng (inline caching). Trong thực tế, hiệu năng hiếm khi là vấn đề trừ các trường hợp cực đoan.

Thêm thuộc tính vào đối tượng sau khi tạo (đặc biệt là thay đổi hình dạng - shape - một cách mạnh mẽ) có thể làm mất tối ưu hóa của engine. Các lớp ẩn (Hidden classes) trong V8 và các cơ chế tương tự dựa vào các đối tượng có hình dạng giống nhau. Cấu trúc đối tượng nhất quán cho phép tối ưu hóa tốt hơn. Khởi tạo tất cả các thuộc tính trong constructor để có hiệu năng tốt nhất.

Chuỗi prototype lớn rất hiếm và thường là dấu hiệu của code kém (code smell). Giữ cho phân cấp nông - một hoặc hai cấp thường là đủ. Phân cấp sâu khó hiểu và bảo trì bất kể hiệu năng. Nếu thấy cần thừa kế sâu, thường là dấu hiệu cho thấy composition là cách tiếp cận tốt hơn.

## Các Mẫu Hiện Đại và Thực Tiễn Tốt Nhất

Hàm nhà máy (Factory functions) trả về đối tượng là giải pháp thay thế phổ biến cho hàm khởi tạo. Hàm tạo và trả về một đối tượng thuần (plain object). Có thể sử dụng `Object.create()` bên trong để thiết lập chuỗi prototype. Không cần từ khóa `new`, giảm bớt sự nhầm lẫn. Mẫu factory linh hoạt, hỗ trợ biến riêng tư thông qua closure.

Cú pháp `class` được khuyến nghị cho hầu hết các trường hợp yêu cầu hành vi giống như hàm khởi tạo. Sạch sẽ hơn, chuẩn hóa hơn so với hàm khởi tạo. Tuy nhiên, hãy hiểu cơ chế prototype bên dưới. Đừng sử dụng class một cách mù quáng ở khắp mọi nơi - đôi khi đối tượng thuần là đủ. Chọn cách tiếp cận phù hợp với miền vấn đề.

Tránh sửa đổi các prototype có sẵn (Array.prototype, Object.prototype, v.v.). Gây ô nhiễm không gian tên toàn cục và có thể xung đột với code khác hoặc các tính năng JavaScript trong tương lai. Nếu cần thêm chức năng, hãy sử dụng các hàm tiện ích hoặc đối tượng bao bọc (wrapper objects). Chỉ sửa đổi prototype mà bạn sở hữu và trong môi trường được kiểm soát.

## Gỡ Lỗi Prototypes

Browser DevTools rất tuyệt vời để khám phá chuỗi prototype. `console.log()` đối tượng và mở rộng nó để xem các thuộc tính riêng và chuỗi `__proto__`. `Object.getPrototypeOf()` truy cập prototype bằng lập trình. Hiểu sự khác biệt giữa thuộc tính riêng và thuộc tính thừa kế là rất quan trọng để gỡ lỗi.

Các vấn đề về tìm kiếm thuộc tính là nguồn gốc phổ biến của lỗi. Thuộc tính `undefined` một cách bất ngờ? Kiểm tra chính tả, kiểm tra chuỗi prototype, kiểm tra xem thuộc tính có thực sự tồn tại không. Thuộc tính sai giá trị? Có thể bị che khuất bởi thuộc tính riêng của đối tượng. Hiểu cơ chế tìm kiếm giúp chẩn đoán nhanh các vấn đề này.

Các vấn đề hiệu năng đôi khi bắt nguồn từ việc tìm kiếm prototype. Phân tích code (profile) bằng cách sử dụng DevTools Performance panel. Việc duyệt chuỗi prototype quá mức sẽ hiển thị như các điểm nóng (hot spots). Tối ưu hóa bằng cách lưu trữ cục bộ các thuộc tính thường xuyên truy cập hoặc làm phẳng phân cấp thừa kế.

## Kết Luận

Thừa kế nguyên mẫu (Prototypal inheritance) là trái tim của hệ thống đối tượng trong JavaScript. Khác biệt với thừa kế cổ điển nhưng cũng mạnh mẽ không kém, mang lại sự linh hoạt và tính động độc đáo. Hiểu về prototypes là điều cần thiết để làm chủ JavaScript, không chỉ sử dụng nó một cách hời hợt.

Cú pháp Class làm cho JavaScript dễ tiếp cận hơn nhưng không nên làm lu mờ cơ chế prototype bên dưới. Hiểu sâu cho phép tận dụng toàn bộ sức mạnh của JavaScript, gỡ lỗi hiệu quả và đưa ra các quyết định thiết kế sáng suốt. Prototypes không chỉ là sự tò mò lịch sử - chúng là tính năng nền tảng định hình cách JavaScript hoạt động.