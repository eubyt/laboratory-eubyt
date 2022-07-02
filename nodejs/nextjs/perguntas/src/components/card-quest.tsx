interface CardQuestHeadType {
  title: string;
  userName: string;
  date: string;
}

interface CardQuestBodyType {
  body: string;
}

interface CardQuestComments {
  id: number;
  userName: string;
  body: string;
}

interface CardQuestType extends CardQuestBodyType, CardQuestHeadType {
  comments?: CardQuestComments[] | [];
}

const Avatar = () => (
  <img
    className="rounded-full w-12 h-12"
    src="https://res.cloudinary.com/practicaldev/image/fetch/s--q5de3DLb--/c_fill,f_auto,fl_progressive,h_90,q_auto,w_90/https://dev-to-uploads.s3.amazonaws.com/uploads/user/profile_image/445678/bc295e1f-3626-403e-bb9d-b476f555155c.png"
  />
);

const CardQuestComment = ({ comments }: { comments: CardQuestComments[] }) => (
  <div className="mt-6 divide-y">
    {comments.length > 0 &&
      comments.map((x) => (
        <div className="flex p-2" key={x.id}>
          <Avatar />
          <div className="justify-center flex flex-col mr-2">
            <div className="text-sm ml-1.5 text-start w-full font-bold">
              {x.userName}
            </div>
            <div className="text-sm ml-1.5 text-start w-full text-neutral-400">
              {x.body}
            </div>
          </div>
        </div>
      ))}
  </div>
);

const CardQuestHead = ({ title, userName, date }: CardQuestHeadType) => (
  <div className="flex items-center justify-between">
    <h2 className="text-2xl">{title}</h2>
    <div className="flex">
      <div className="justify-center flex flex-col mr-2">
        <div className="text-sm mr-1 text-end w-full font-bold">{userName}</div>
        <div className="text-sm mr-1 text-end w-full text-neutral-400">
          {date}
        </div>
      </div>
      <Avatar />
    </div>
  </div>
);

const CardQuestBody = ({ body }: CardQuestBodyType) => (
  <div className="mt-2">
    <div className="text-base">{body}</div>
  </div>
);

const CardQuest = ({
  title,
  userName,
  date,
  body,
  comments = [],
}: CardQuestType) => (
  <div className="border border-zinc-300 rounded-md drop-shadow-md p-3 flex flex-col w-auto mt-4">
    <CardQuestHead title={title} userName={userName} date={date} />
    <CardQuestBody body={body} />
    <CardQuestComment comments={comments} />
  </div>
);

export default CardQuest;
