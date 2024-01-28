import { createParser } from "eventsource-parser";


export const OpenAIStream = async (body) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  console.log("body: ",body)
  console.log(process.env.OPENAI_API_KEY)

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer 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`,
    }, 
    method: "POST",
    body: JSON.stringify(body)
  });
  console.log(res)
  // var data1 = await res.text()
  // var data2 = JSON.stringify(data1)
  // console.log(data1)

  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error");
  }

  // const stream = new ReadableStream({
  //   async start(controller) {
  //     const onParse = (event) => {
  //       if (event.type === "event") {
  //         const data = event.data;

  //         if (data === "[DONE]") {
  //           controller.close();
  //           return;
  //         }

  //         try {
  //           const json = JSON.parse(data);
  //           const text = json.choices[0].delta.content;
  //           const queue = encoder.encode(text);
  //           controller.enqueue(queue);
  //         } catch (e) {
  //           controller.error(e);
  //         }
  //       }
  //     };

  //     const parser = createParser(onParse);

  //     console.log("resBody: ",res.body.getReader())

  //     for await (var chunk of (res.body).getReader()) {
  //       parser.feed(decoder.decode(chunk));
  //     }
  //   },
  // });
  // console.log("stream: ",stream)
  return res.body

  // return new Response(stream, {status: 200});
};

export async function streamOpenAIResponse(response, callback) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let done = false;
  let text = "";
  let isFirst = true;
  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    console.log(value)
    const chunkValue = decoder.decode(value);
    const lines = chunkValue.split("\\n");
    console.log(lines)
    // lines.replace(/^data: /, "").trim()
    // console.log(lines)
      const parsedLines = lines
        .map((line) => line.replace(/^data: /, "").trim()) // Remove the "data: " prefix
        .filter((line) => line !== "" && line !== "[DONE]") // Remove empty lines and "[DONE]"
        // .map((line) => line.replace("\\n\\n",""))
        .map(async (line) => await JSON.parse(line)); // Parse the JSON string
      // console.log(newparse)

        for (const parsedLine of parsedLines) {
          const { choices } = parsedLine;
          console.log(choices)
          const { delta } = choices[0];
          const { content } = delta;
          // Update the UI with the new content
          if (content) {
            text += content;
            callback(text, isFirst);
          isFirst = false;
          }
        }

    // const json = await JSON.parse(await chunkValue.data);
    // const newJson = JSON.parse(json)
    // console.log(newJson)
    // const newChunk = json.choices[0].delta.content;
    // text += newChunk;
    // callback(text, isFirst);
    // isFirst = false;
  }
}

