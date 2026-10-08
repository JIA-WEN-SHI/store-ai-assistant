import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("实体门店 AI 经营助手", () => {
  it("从登录页进入示例门店后展示经营看板", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: "体验示例门店" }));
    await userEvent.click(screen.getByRole("button", { name: "生成我的门店经营助手" }));

    expect(screen.getByRole("heading", { name: "经营看板" })).toBeInTheDocument();
    expect(screen.getByText("今日建议优先做老客回访")).toBeInTheDocument();
  });

  it("可以进入营销助手并生成多平台活动内容", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: "体验示例门店" }));
    await userEvent.click(screen.getByRole("button", { name: "生成我的门店经营助手" }));
    await userEvent.click(screen.getByRole("button", { name: "生成今日营销" }));
    await userEvent.click(screen.getByRole("button", { name: "下一步" }));
    await userEvent.click(screen.getByRole("button", { name: "生成活动内容" }));

    expect(screen.getByRole("heading", { name: "活动方案" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "朋友圈文案" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "小红书文案" })).toBeInTheDocument();
  });

  it("客户管理页可以打开客户详情并显示回访话术", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: "体验示例门店" }));
    await userEvent.click(screen.getByRole("button", { name: "生成我的门店经营助手" }));
    await userEvent.click(screen.getByRole("button", { name: "客户管理" }));
    await userEvent.click(screen.getByRole("button", { name: "查看王女士详情" }));

    expect(screen.getByRole("heading", { name: "王女士" })).toBeInTheDocument();
    expect(screen.getByText("推荐回访话术")).toBeInTheDocument();
  });

  it("数据接入页可以接入营销资料并影响营销助手的数据来源展示", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: "体验示例门店" }));
    await userEvent.click(screen.getByRole("button", { name: "生成我的门店经营助手" }));
    await userEvent.click(screen.getByRole("button", { name: "数据接入" }));

    expect(screen.getByRole("heading", { name: "数据接入" })).toBeInTheDocument();
    expect(screen.getByText("营销内容输出资料")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "接入历史活动数据" }));
    await userEvent.click(screen.getByRole("button", { name: "接入素材与话术" }));

    expect(screen.getByText("历史活动数据已接入")).toBeInTheDocument();
    expect(screen.getByText("素材与话术已接入")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "去生成营销内容" }));

    expect(screen.getByRole("heading", { name: "营销助手" })).toBeInTheDocument();
    expect(screen.getByText("已接入历史活动数据")).toBeInTheDocument();
    expect(screen.getByText("已接入素材与话术")).toBeInTheDocument();
  });
});
